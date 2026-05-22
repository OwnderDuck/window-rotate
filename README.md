[中文](assets/README_ZH)
# Window Rotate
Window Rotate is a Gnome extension designed to **rotate windows**.

[<img width="200" src="https://github.com/andyholmes/gnome-shell-extensions-badge/raw/master/get-it-on-ego.svg">](https://extensions.gnome.org/extension/9766/window-rotate/)
<img width="1920" height="1080" alt="Screenshot From 2026-04-18 17-20-08" src="https://github.com/user-attachments/assets/806a9488-8347-49e4-ba40-be3c595a4123" />

## Usage
- Press `Super+R` to enable rotation, move the mouse to control the direction, and press `Super+R` again to exit.
- Press `Super+Shift+R` to reset the rotation angle.
## Features
- **OSD** (On-Screen Display) for the current angle
- **TODO**: Customizable shortcuts
## Bugs
- In some applications (notably certain Qt and GPU-accelerated clients such as kitty), mouse click positions may become offset from the visible cursor after window rotation. GTK and Chromium-based applications appear unaffected. This seems related to input region / pointer coordinate handling for transformed window actors under Wayland.
- Potential blurriness/loss of clarity.
- no OSD in GNOME 45-48
