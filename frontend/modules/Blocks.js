/**
 * This class represents a list of blocks.
 */

export class Blocks {
    constructor() {
        this.blocks = [];
        this.player = -1;
    }

    addBlock(id, player, text, action, uses, canUse) {
        const block = {id, player, text, action, uses, canUse};
        this.blocks.push(block);
    }

    useBlock(id, socket) {
        const block = this.blocks.find(e => e.id === id);
        if (typeof block === "undefined") return;
        socket.emit("blockUsed", id);
    }

    /**
     * Renders the blocks, clearing unused ones.
     * @param {*} socket 
     */
    renderBlocks(socket) {
        const blockList = document.getElementById("blockList");
        const template = document.getElementById("scriptBlockTemplate");

        for (let block of this.blocks) {
            if (block.player !== -1 && block.player !== this.player) continue;
            let clone, button, text, uses;
            if (typeof block.element !== "undefined") {
                clone = block.element;
                button = clone;
                text = clone.querySelector(".scriptBlockCode");
                uses = clone.querySelector(".scriptBlockUses");
            } else {
                clone = template.content.cloneNode(true);
                button = clone.querySelector("button");
                text = clone.querySelector(".scriptBlockCode");
                uses = clone.querySelector(".scriptBlockUses");
            }
            if (block.player === -1) button.classList.add("btn-success");
            else button.classList.add("btn-primary");
            button.id = block.id;
            button.disabled = !block.canUse;
            button.onclick = () => this.useBlock(block.id, socket);
            text.innerHTML = block.text;
            uses.textContent = (block.uses === -1 ? '∞' : block.uses);
            if (typeof block.element === "undefined") {
                blockList.appendChild(clone);
                block.element = document.getElementById(block.id);
            }
        }
    }

    initBlocks(socket, player) {
        console.info("blocks", this.blocks);
        
        const blockList = document.getElementById("blockList");
        blockList.innerHTML = "";
        this.player = player;
        this.renderBlocks(socket);
    }
}