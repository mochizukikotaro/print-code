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
  screenRow: null,
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
      'print-code:print': () => this.print(),
      'print-code:reset': () => this.reset()
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

  addOriginalClass() {
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
  },

  setTimeoutAsync(delay) {
    return new Promise(function(resolve, reject) {
      window.setTimeout(resolve, delay);
    });
  },

  reset() {
    $(elements).removeClass('print-code')
    $('html').css('height', '')
    $('html').css('width', '')
  },

  goBottom() {
    return new Promise((resolve, reject)=>{
      atom.workspace.getActiveTextEditor().moveToBottom()
      atom.workspace.getActiveTextEditor()
        .onDidChangeCursorPosition(resolve)
    })
  },

  calc() {
    return new Promise((resolve, reject)=>{
      this.setTimeoutAsync(300)
        .then(function(){
          screenRow = $("[data-buffer-row='"+(bufferRow-1)+"']").data('screen-row')
          htmlHeight = (screenRow * lineHeight) + 20
          $('html').css('height', htmlHeight)
          resolve
        })
    })
  },

  delayPrint() {
    this.setTimeoutAsync(400)
      .then(()=>{
        atom.workspace.getActiveTextEditor().moveToTop()
        window.print()
        this.reset()
      })
  },

  print() {
    this.addOriginalClass()
    lineHeight = parseInt($('atom-text-editor').css('line-height'), 10)
    bufferRow = atom.workspace.getActivePaneItem().buffer.lines.length

    atom.workspace.getActiveTextEditor().setSoftWrapped(true)
    this.setTimeoutAsync(1000)
      .then(()=>{this.goBottom()})
      .then(()=>{this.calc()})
      .then(()=>{this.delayPrint()})
    return
  }
};
