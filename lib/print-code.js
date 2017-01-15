'use babel';

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

  print() {
    console.log('I wanna print!!');
    window.print();
  }
};
