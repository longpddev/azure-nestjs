import { create } from 'zustand';

type KeyCode =
  | 'Backspace'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Shift'
  | 'Control'
  | 'Control'
  | 'Alt'
  | 'Alt'
  | 'Pause'
  | 'CapsLock'
  | 'Escape'
  | ''
  | 'PageUp'
  | 'PageDown'
  | 'End'
  | 'Home'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'PrintScreen'
  | 'Insert'
  | 'Delete'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'Meta'
  | 'Meta'
  | 'ContextMenu'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '*'
  | '+'
  | '-'
  | '.'
  | '/'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'NumLock'
  | 'ScrollLock'
  | 'AudioVolumeMute'
  | 'AudioVolumeDown'
  | 'AudioVolumeUp'
  | 'LaunchMediaPlayer'
  | 'LaunchApplication1'
  | 'LaunchApplication2'
  | ';'
  | '='
  | ','
  | '-'
  | '.'
  | '/'
  | '`'
  | '['
  | '\\'
  | ']'
  | "'";

interface GlobalKeyBoardStore {
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  keyString?: KeyCode;
  reset: () => void;
}

export const useGlobalKeyBoard = create<GlobalKeyBoardStore>((set) => ({
  ctrlKey: false,
  shiftKey: false,
  metaKey: false,
  altKey: false,
  keyString: undefined,
  reset() {
    set({
      ctrlKey: false,
      shiftKey: false,
      metaKey: false,
      keyString: undefined,
      altKey: false,
    });
  },
}));

document.addEventListener('keydown', (e) => {
  console.log('keydown', e);
  useGlobalKeyBoard.setState({
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    metaKey: e.metaKey,
    keyString: e.code as KeyCode,
    altKey: e.altKey,
  });
});

document.addEventListener('keyup', () => {
  useGlobalKeyBoard.getState().reset();
});
