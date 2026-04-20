/*
 * Copyright (c) 2026 OwnderDuck ownderduck@gmail.com
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 * * See the LICENSE file in the repository root for full license text.
 */
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
