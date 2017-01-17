'use babel';

$ = require('jquery');

import PrintCodeView from './print-code-view';
import { CompositeDisposable } from 'atom';

export default {

  printCodeView: null,
  modalPanel: null,
  subscriptions: null,

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
    // Hide left panels
    panels = atom.workspace.getLeftPanels()
    panels.forEach(function(v, i, a){
      if (v.visible === true) {
        v.hide()
      }
    })
    $('html').addClass('print-code')
    $('body').addClass('print-code')
    $('.tab-bar').addClass('print-code')
    $('.pane').addClass('print-code')
  },

  back() {
    // Show panels
    panels = atom.workspace.getLeftPanels()
    panels.forEach(function(v, i, a){
      if (v.visible !== true) {
        v.show()
      }
    })
    $('html').removeClass('print-code')
    $('body').removeClass('print-code')
    $('.tab-bar').removeClass('print-code')
    $('.pane').removeClass('print-code')
  },

  print() {
    this.go()
    window.setTimeout(function(){
      window.print()
      // this.back()
      // ここで、 this.back をどうよぶか
    }, 500)
  }
};
