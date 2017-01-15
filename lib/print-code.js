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

    // パネルを非表示にする
    panels = atom.workspace.getLeftPanels()
    panels.forEach(function(v, i, a){
      if (v.visible === true) {
        v.hide()
      }
    })

    // タブを非表示にする
    tabs = document.getElementsByClassName('tab-bar');
    for(var i=0;i<tabs.length;i++){
      tabs[i].style.display = "none";
    }

    // pane の幅を 100% にする。他は 0 にする。
    // なんで jQuery 使えないんだ...
    panes = document.getElementsByClassName('pane')
    for(i=0;i<panes.length;i++){
      flexGrow = panes[i].style.flexGrow
      panes[i].setAttribute('data-flex', flexGrow)
      if (!panes[i].className.match(/active/)) {
        panes[i].style.flexGrow = 0
      }
    }

    // ここで印刷
    window.print()

    // もとに戻す
    panels.forEach(function(v, i, a){
      if (v.visible !== true) {
        v.show()
      }
    })
    for(var i=0;i<tabs.length;i++){
      tabs[i].style.display = "block";
    }

  }

};
