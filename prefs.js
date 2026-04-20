/*
 * Copyright (c) 2026 OwnderDuck ownderduck@gmail.com
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 * * See the LICENSE file in the repository root for full license text.
 */
 'use strict';

import Adw from 'gi://Adw';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class WindowRotatePrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({ title: 'General' });
        page.add(group);
        window.add(page);
    }
}
