import { ref, type Ref } from 'vue'

export const inputsEnabled = ref(false)

const startX = ref()
const startY = ref()
const endX = ref()
const endY = ref()

const up = ref(false); const right = ref(false); const down = ref(false); const left = ref(false);

export function disableKeyInputs() {
    inputsEnabled.value = false
}

export function enableKeyInputs() {
    inputsEnabled.value = true
}

export function useRegisterMove(keyPressed: string) : "up" | 'right' | 'down' | 'left' | undefined {
    if (keyPressed === 'ArrowUp') {
        return 'up';
    } else if (keyPressed === 'ArrowRight') {
        return 'right';
    } else if (keyPressed === 'ArrowDown') {
        return 'down';
    } else if (keyPressed === 'ArrowLeft') {
        return 'left';
    }
}

export function usePointer(event: any) {
    if (startX.value && endX.value) startX.value = startY.value = endX.value = endY.value = null; // reset all the values if there has been a start and a end.

    if (event.type === 'touchstart') startX.value = event.touches[0].clientX, startY.value = event.touches[0].clientY;
    if (event.type === 'touchend') endX.value = event.changedTouches[0].clientX, endY.value = event.changedTouches[0].clientY;

    if (startX.value && endX.value) {
        const diffX = startX.value - endX.value
        const diffY = startY.value - endY.value

        if (Math.abs(diffY) > Math.abs(diffX) && diffY < 0) return 'down';
        if (Math.abs(diffY) > Math.abs(diffX) && diffY > 0) return 'up';
        if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0) return 'right';
        if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0) return 'left';
    }
}

export function useDeviceInfo() {
    const ua = navigator.userAgent

    if (/Android/i.test(ua)) {
        return true;
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        return true;
    } else if (/Windows/i.test(ua)) {
        return false;
    } else if (/Mac/i.test(ua)) {
        return false;
    } else {
        return false
    }
  }

export function useOrientation(initialAlpha: number | null, initialBeta: number | null, initialGamma: number | null, event: any) {

    // const alpha = event.alpha
    const gamma = event.gamma
    const beta = event.beta

    if (initialGamma && gamma <= initialGamma) {
        const deltaG = Math.abs(initialGamma - gamma)

        if (deltaG <= 5 && left.value) left.value = false;
        if (deltaG >= 20 && !left.value) {
            left.value = true
            return 'left';
        }
    } else if (initialGamma && gamma >= initialGamma) {
        const deltaG = Math.abs(gamma - initialGamma)

        if (deltaG <= 5 && right.value) right.value = false;
        if (deltaG >= 20 && !right.value) {
            right.value = true
            return 'right';
        }
    }
    
    if (initialBeta && beta <= initialBeta) {
        const deltaB = Math.abs(initialBeta - beta)

        if (deltaB <= 5 && up.value) up.value = false;
        if (deltaB >= 20 && !up.value) {
            up.value = true;
            return 'up';
        }
    } else if (initialBeta && beta >= initialBeta) {
        const deltaB = Math.abs(beta - initialBeta)

        if (deltaB <= 5 && down.value) down.value = false;
        if (deltaB >= 20 && !down.value) {
            down.value = true;
            return 'down';
        }
    }
}

  