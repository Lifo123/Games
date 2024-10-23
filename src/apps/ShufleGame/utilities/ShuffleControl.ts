import { ShufleGameStore, validWordStore } from "../context/ShufleGameStore";
import { GameUtil, Local } from "./ShuffleUtilities";
import { node } from 'lifo-utils'
import { toast } from "sonner";

const typing = (input: string) => {
    const data = ShufleGameStore.get();
    const game = data.gameState
    const curLetter = game.currentLetter

    if (curLetter > data.gameSettings.Length - 1) {
        return;
    }

    let updatedData = node.set(`gameState/valid/${game.currentRow}/${curLetter}/char`, {
        value: input,
        data: data,
    });

    // Actualizar la letra actual
    node.set('gameState/currentLetter', {
        value: curLetter + 1,
        data: data,
    });

    ShufleGameStore.set(updatedData);
    updatedData = null;
}
const backspace = () => {
    const data = ShufleGameStore.get();
    const game = data.gameState
    const curLetter = game.currentLetter

    if (curLetter <= 0) {
        return;
    }

    let updatedData = node.set(`gameState/valid/${game.currentRow}/${curLetter - 1}/char`, {
        value: '',
        data: data,
    });

    node.set('gameState/currentLetter', {
        value: curLetter - 1,
        data: data,
    });

    ShufleGameStore.set(updatedData);
    updatedData = null;
}

const enter = () => {
    const data = ShufleGameStore.get();
    const game = data.gameState
    const curLetter = game.currentLetter

    if (curLetter < data.gameSettings.Length) {
        toast.error('Field is not complete');
        return;
    }

    const curRow = game.currentRow
    const guess = game.valid[curRow].map((box: any) => box.char).join('')

    const isValidWord: any = GameUtil.verifyWord(guess);

    if (!isValidWord) {
        toast.error('Invalid word');
        return
    }

    const isValidVerify = GameUtil.comparingWord(game.word, game.swaps, guess);


    return

    let updatedData = node.set(`gameState/currentRow,currentLetter,guess`, {
        value: [curRow + 1, 0, guess],
        data: data,
    });



}


export const control = {
    typing,
    backspace,
    enter
};