'use strict';

export class SettingsData {
    constructor(settings) {
        const stepKey = 'rotate-step';
        this.ROTATE_STEP = {
            key: stepKey,
            get: () => settings.get_double(stepKey),
            set: (v) => settings.set_double(stepKey, v)
        };
    }
}
