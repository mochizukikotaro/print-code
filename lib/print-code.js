'use babel';

$ = require('jquery');

import PrintCodeView from './print-code-view';
import { CompositeDisposable } from 'atom';

export default {

  printCodeView: null,
  modalPanel: null,
  subscriptions: null,

  // print-code properties
  elements: null,
  lineHeight: null,
  lineLength: null,
  htmlHeight: null,

  activate(state) {
    this.printCodeView = new PrintCodeView(state.printCodeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.printCodeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'print-code:print': () => this.print()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.printCodeView.destroy();
  },

  serialize() {
    return {
      printCodeViewState: this.printCodeView.serialize()
    };
  },

  format() {
    atom.workspace.getActiveTextEditor().setSoftWrapped(true)
    atom.workspace.getActiveTextEditor().moveToTop()

    elements = [
      'html',
      'body',
      'atom-panel-container.left',
      'atom-panel-container.right',
      'atom-panel-container.footer',
      '.tab-bar',
      '.pane'
    ].join(',')

    $(elements).addClass('print-code')

    lineHeight = parseInt($('atom-text-editor').css('line-height'), 10)
    lineLength = atom.workspace.getActivePaneItem().buffer.lines.length
    htmlHeight = (lineLength * lineHeight) + 20

    $('html').css('height', htmlHeight)
    $('html').css('width', 640)
  },

  resetFormat() {
    $(elements).removeClass('print-code')
    $('html').css('height', '')
    $('html').css('width', '')
  },

  print() {
    this.format()
    var obj = this
    window.setTimeout(function(){
      window.print()
      obj.resetFormat()
    }, 400)
  }
};
