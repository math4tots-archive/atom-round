'use babel';

import RoundView from './round-view';
import { CompositeDisposable } from 'atom';

export default {

  roundView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.roundView = new RoundView(state.roundViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.roundView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      // 'round:toggle': () => this.toggle()
      'round:round': () => this.round(),
      'round:centi-round': () => this.centiRound()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.roundView.destroy();
  },

  serialize() {
    return {
      roundViewState: this.roundView.serialize()
    };
  },

  toggle() {
    console.log('Round was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  round() {
    const editor = atom.workspace.getActivePaneItem();
    for (const selection of editor.getSelections()) {
      const text = selection.getText();
      selection.insertText(Math.round(parseFloat(text)).toString());
    }
  },

  centiRound() {
    const editor = atom.workspace.getActivePaneItem();
    for (const selection of editor.getSelections()) {
      const text = selection.getText();
      selection.insertText(parseFloat(text).toFixed(2));
    }
  }
};
