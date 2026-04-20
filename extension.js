/*
 * Copyright (c) 2026 OwnderDuck ownderduck@gmail.com
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 * * See the LICENSE file in the repository root for full license text.
 */
 'use strict';
 
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { SettingsData } from './settings_data.js';

export default class WindowRotateExtension extends Extension {
    enable() {
        this.settingsData = new SettingsData(this.getSettings());
        this._rotateTimer = null;
        this._rotatingActor = null;
        this._focusId = 0;

        this._pressBindingId = Main.wm.addKeybinding(
            'rotate-window-press',
            this.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            this._toggleRotation.bind(this)
        );
        this._resetBindingId = Main.wm.addKeybinding(
            'reset-window-rotation',
            this.getSettings(),
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL,
            this._resetRotation.bind(this)
        );
    }

    _toggleRotation() {
        // if rotating, stop
        if (this._rotateTimer) {
            this._stopRotation();
            return;
        }

        // prepare to rotate
        const focusWin = global.display.focus_window;
        if (!focusWin) return;

        const actor = focusWin.get_compositor_private();
        if (!actor) return;

        actor.set_pivot_point(0.5, 0.5);
        this._rotatingActor = actor;
        
        const rotateIcon = new Gio.ThemedIcon({ name: 'object-rotate-right-symbolic' });
        // start to rotate
        this._rotateTimer = setInterval(() => {
            if (!this._rotatingActor || this._rotatingActor.is_destroyed()) {
                this._stopRotation();
                return;
            }
            const [mouseX, mouseY] = global.get_pointer();
            const rect = this._rotatingActor.get_transformed_extents();
            const centerX = rect.origin.x + (rect.size.width / 2);
            const centerY = rect.origin.y + (rect.size.height / 2);

            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            let angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
            while (angleDeg < -180) angleDeg += 180;
            while (angleDeg >= 180) angleDeg -= 180;
            // snap
            const snapThreshold = 1;
            const snapPoints = [0, 90, 180, 270, -90, -180];
            
            for (let snap of snapPoints) {
                if (Math.abs(angleDeg - snap) < snapThreshold) {
                    angleDeg = snap;
                    break;
                }
            }
            this._rotatingActor.rotation_angle_z = angleDeg;
            let displayAngleDeg = angleDeg;
            const levels = global.display.get_n_monitors() > 0 
                ? Array(global.display.get_n_monitors()).fill({
                    level: displayAngleDeg / 360 + 0.5,
                    maxLevel: 1.0
                  })
                : [{ level: displayAngleDeg / 360 + 0.5, maxLevel: 1.0 }];
            Main.osdWindowManager.show(
                rotateIcon, 
                `${displayAngleDeg.toFixed(1)}°`,
                levels
            );
            
        }, 16);

        // if unfocused, stop
        if (this._focusId === 0) {
            this._focusId = global.display.connect('notify::focus-window', () => this._stopRotation());
        }
        
        // click, stop
        this._clickId = global.stage.connect('button-press-event', () => this._stopRotation());
    }

    _stopRotation() {
        if (this._rotateTimer) {
            clearInterval(this._rotateTimer);
            this._rotateTimer = null;
        }

        if (this._focusId !== 0) {
            global.display.disconnect(this._focusId);
            this._focusId = 0;
        }

        if (this._clickId) {
            global.stage.disconnect(this._clickId);
            this._clickId = null;
        }

        this._rotatingActor = null;
    }

     _resetRotation() {
        this._stopRotation();

        const focusWin = global.display.focus_window;
        if (!focusWin) return;

        const actor = focusWin.get_compositor_private();
        if (!actor) return;

        actor.rotation_angle_z = 0;
    }

    disable() {
        this._stopRotation();
        Main.wm.removeKeybinding('rotate-window-press');
        Main.wm.removeKeybinding('reset-window-rotation');
        this.settingsData = null;
    }
}
