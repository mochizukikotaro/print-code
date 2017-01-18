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
  srcHtmlHeight: null,
  dstHtmlHeight: null,

  activate(state) {
    this.printCodeView = new PrintCodeView(state.printCodeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.printCodeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'print-code:go': () => this.go()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'print-code:print': () => this.print()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'print-code:back': () => this.back()
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

  go() {
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
    dstHtmlHeight = (lineLength * lineHeight) + 20
    srcHtmlHeight = $('html').css('height')
    $('html').css('height', dstHtmlHeight)
  },

  back() {
    $(elements).removeClass('print-code')
    $('html').css('height', srcHtmlHeight)
  },

  print() {
    this.go()
    var obj = this // for obj.back()
    window.setTimeout(function(){
      window.print()
      obj.back()
    }, 400)
  }
};
