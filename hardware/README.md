# CueBot Hardware Build Guide

CueBot is built from off-the-shelf parts. The complete platform used in the study cost **$738**. This guide lists the parts, explains how they fit together, and describes how to swap the laptop for a Raspberry Pi if you want a self-contained cart.

## Parts list

| Part | Purpose | Cost (USD) |
|---|---|---|
| Mobile cart platform with drawers <!-- FILL IN: model or link --> | The storage cart the robot is built on | $580 |
| LED strips <!-- FILL IN: product, colour, and length --> | Light-blue indicators on each drawer front and inside each compartment | Included below |
| LED controller <!-- FILL IN: e.g. remote, app, or microcontroller --> | Turns individual drawer and compartment LEDs on and off | Included below |
| Bluetooth speaker <!-- FILL IN: model --> | Plays the speech cues | Included below |
| Wiring and mounting hardware | Connects and attaches the LEDs | Included below |
| **LEDs, speaker, controller, and wiring (subtotal)** | | **$158** |
| Laptop | Runs the web interface and plays audio | Existing lab hardware, no added cost |
| **Total** | | **$738** |

**Optional, for a self-contained cart:** a Raspberry Pi 4B (about $45) with a small screen and keyboard can replace the laptop. The web interface runs in any modern browser, so no code changes are needed.

## How the parts fit together

CueBot has three communication channels. Each one uses different hardware.

**1. LED indicators (non-verbal cues)**

Each drawer has an LED on the outside of the cart, and each compartment has an LED inside its drawer. When an item is requested, the LED on the correct drawer flashes to show the user which level to open. Once the drawer is open, the LED on the correct compartment flashes to show exactly where the item is.

<!-- FILL IN: describe how the LEDs were mounted and wired (one strip segment per drawer and per compartment?), how they are powered, and how the operator turned a specific LED on during the study. -->

**2. Speaker (verbal cues)**

The Bluetooth speaker sits on the top surface of the cart and is paired with the laptop. When the web interface locates an item, it plays a short speech clip through the laptop's audio output, which is the speaker. Each clip follows the same template: "Located in drawer {drawer}, compartment {compartment}."

The clips are pre-generated text-to-speech recordings, one per compartment, stored in `backend/public/audio-layperson/` and `backend/public/audio-rn/`. The file name gives the location, so `2-3.mp3` says "Located in drawer two, compartment three."

<!-- FILL IN: name the text-to-speech tool and voice used to generate the clips. -->

**3. Screen (web interface)**

The laptop displays the web interface next to the cart. See the main [README](../README.md) for how to run it.

## Assembly steps

1. **Prepare the cart.** Decide how many compartments each drawer will have and set up the dividers. The two layouts used in the study are listed in [`study-materials/`](../study-materials/README.md).
2. **Install the drawer LEDs.** Attach one LED to the front of each drawer where it is easy to see from standing height.
3. **Install the compartment LEDs.** Attach one LED inside each compartment, positioned so it is visible when the drawer is opened.
4. **Connect and power the LEDs.** <!-- FILL IN: wiring and controller steps. -->
5. **Mount the speaker.** Place the Bluetooth speaker on the top surface of the cart and pair it with the laptop (or Raspberry Pi). Set it as the default audio output.
6. **Place the screen.** Put the laptop on or next to the cart where the user can see it while facing the drawers.
7. **Stock the cart and update the inventory file.** Put each item in its compartment and make sure `backend/inventory-<cart>.json` lists the same drawer and compartment for every item. If you change the layout, also record new speech clips and add drawer images (see "Adapting CueBot to your own cart" in the main README).
8. **Test each cue.** Search for one item from every drawer and check that the screen, speech, and LEDs all point to the same place.
