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

  },

  back() {
  },

  print() {

    // Hide left panels
    panels = atom.workspace.getLeftPanels()
    panels.forEach(function(v, i, a){
      if (v.visible === true) {
        v.hide()
      }
    })

    // Hide tab-bar
    tabs = document.getElementsByClassName('tab-bar');
    for(let i=0;i<tabs.length;i++){
      tabs[i].style.display = "none";
    }

    // Hide non-active panes
    panes = document.getElementsByClassName('pane')
    for(let i=0;i<panes.length;i++){
      flexGrow = panes[i].style.flexGrow
      panes[i].setAttribute('data-flex', flexGrow)
      if (!panes[i].className.match(/active/)) {
        panes[i].style.flexGrow = 0
      }
    }

    window.print()

    // Show panels
    panels.forEach(function(v, i, a){
      if (v.visible !== true) {
        v.show()
      }
    })

    // Show tabs
    for(let i=0;i<tabs.length;i++){
      tabs[i].style.display = "block";
    }

    // Show non-active panes
    for(let i=0;i<panes.length;i++){
      panes[i].style.flexGrow = panes[i].dataset.flex
    }


  }
};
