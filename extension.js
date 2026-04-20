'use strict';

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
            const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
            this._rotatingActor.rotation_angle_z = angleDeg;
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

    disable() {
        this._stopRotation();
        Main.wm.removeKeybinding('rotate-window-press');
        this.settingsData = null;
    }
}
