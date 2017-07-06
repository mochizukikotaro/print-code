'use babel';

$ = require('jquery');

import PrintCodeView from './print-code-view';
import { CompositeDisposable } from 'atom';

export default {

  config: {
    'hideInvisibles': {
      "description": "Hide invisible symboles in output document",
      "type": "boolean",
      "default": "true"
    }
  },


  printCodeView: null,
  modalPanel: null,
  subscriptions: null,

  // print-code properties
  elements: null,
  lineHeight: null,
  screenRow: null,
  htmlHeight: null,

  showInvisibles: atom.config.get('editor.showInvisibles'),

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
      '.tab-bar'
    ].join(',')
    $(elements).addClass('print-code')
  },

  reset() {
    $(elements).removeClass('print-code')
    $('html').css('height', '')
    $('html').css('width', '')
    atom.config.set('editor.showInvisibles', this.showInvisibles)
  },

  print() {

    // TODO: Check ActivePane
    // if (!atom.workspace.getActiveTextEditor()){
    //   atom.notifications.addInfo('Please put your cursor on TextEditor')
    // }

    this.addOriginalClass()
    lineHeight = parseInt($('atom-text-editor').css('line-height'), 10)

    atom.workspace.getActiveTextEditor().setSoftWrapped(true)

    const setTimeoutAsync = (delay) => {
      return new Promise((resolve, reject) => {
        window.setTimeout(resolve, delay);
      });
    }

    const goBottom = () => {
      return new Promise((resolve, reject)=>{
        atom.workspace.getActiveTextEditor().moveToBottom()
        setTimeoutAsync(300).then(()=>{
          bottomScreenRow = atom.workspace
                                .getActiveTextEditor()
                                .getCursorScreenPosition()
                                .row
          resolve(bottomScreenRow)
        })
      })
    }

    const setScreenSize = (screenRow) => {
      return new Promise((resolve, reject) => {
        htmlHeight = (screenRow * lineHeight) + 20
        $('html').css('height', htmlHeight)
        setTimeoutAsync(200).then(resolve)
      })
    }

    const goTop = () => {
      return new Promise((resolve, reject) => {
        atom.workspace.observeTextEditors((editor) => {
          editor.onDidChangeCursorPosition((event) => {resolve(event)})
          editor.moveToTop()
        })
      })
    }

    const printScreen = () => {
      setTimeoutAsync(300).then(()=> {
        window.print()
        this.reset()
      })
    }

    const hideInvisibles = () => {
      if(atom.config.get('print-code.hideInvisibles')) {
        atom.config.set('editor.showInvisibles', false)
      }
    }

    setTimeoutAsync(700)
      .then(hideInvisibles)
      .then(goBottom)
      .then(setScreenSize)
      .then(goTop)
      .then(printScreen)

    return
  }
};
