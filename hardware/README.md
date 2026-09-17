# CueBot Hardware Build Guide

CueBot is built from inexpensive, off-the-shelf parts and needs no soldering or wiring. This guide lists the parts, explains how they fit together, and describes how to swap the laptop for a Raspberry Pi if you want a self-contained cart.

## Parts list

The specific products below are the ones used in the study. Any equivalent product will work.

| Part | Product used | Purpose | Approx. price (USD) |
|---|---|---|---|
| Mobile cart | [Medical rolling crash cart with wheels, CPR board, and IV pole](https://www.amazon.com/dp/B0D6GHMDFJ) (OLERN) | The storage cart the robot is built on | $550 |
| LED lights | [Mini submersible LED lights with remote, 10-pack](https://www.amazon.com/dp/B0CMZNDHL8) (Sunnyes) | Drawer and compartment indicators | $22 per 10-pack |
| Speaker | [Bluetooth 5.0 shower speaker](https://www.amazon.com/dp/B07N985DN9) (Johns Avenue) | Plays the speech cues | $20 |
| Mounting tape | Gorilla Tape | Attaches the LED lights to the cart | A few dollars |
| Batteries | Coin-cell batteries for the LED lights | Powers the LED lights | Varies |
| Laptop | Any laptop with a web browser | Runs the web interface and plays audio | Existing hardware |

<!-- FILL IN: reconcile these prices with the $738 total reported in the paper. -->

**How many LED lights you need.** You need one light inside each compartment and one on the outside of each drawer. For the layperson cart in the study (five drawers with 4, 6, 8, 6, and 4 compartments), that is 28 + 5 = 33 lights, or four 10-packs. For another layout, add up the compartments, add the number of drawers, and round up to the next 10-pack.

**LED requirements if you choose a different product.** The lights must be battery powered, so the cart needs no wiring, and remote controlled, so the operator can switch them on from out of view. They must also be small enough to fit inside a compartment. The study used light-blue lights.

**Optional, for a self-contained cart:** a Raspberry Pi 4B (about $45) with a small screen and keyboard can replace the laptop. The web interface runs in any modern browser, so no code changes are needed.

## How the parts fit together

CueBot has three communication channels. Each one uses different hardware.

**1. LED indicators (non-verbal cues)**

Each drawer has an LED light on the outside of the cart, and each compartment has an LED light inside its drawer. When an item is requested, the light on the correct drawer flashes to show the user which level to open. Once the drawer is open, the light in the correct compartment flashes to show exactly where the item is.

The lights run on their own batteries and are not connected to the CueBot software. In the study, a hidden Wizard-of-Oz operator switched on the correct drawer and compartment lights for each item using the lights' remote control. This kept the LED cues independent of any sensing or detection errors. A future autonomous version could replace the remote-controlled lights with LEDs driven by the backend.

**2. Speaker (verbal cues)**

The Bluetooth speaker sits on the top surface of the cart and is paired with the laptop. When the web interface locates an item, it plays a short speech clip through the laptop's audio output, which is the speaker. Each clip follows the same template: "Located in drawer {drawer}, compartment {compartment}."

The clips are pre-generated text-to-speech recordings, one per compartment, stored in `backend/public/audio-layperson/` and `backend/public/audio-rn/`. The file name gives the location, so `2-3.mp3` says "Located in drawer two, compartment three."

<!-- FILL IN: name the text-to-speech tool and voice used to generate the clips. -->

**3. Screen (web interface)**

The laptop displays the web interface next to the cart. See the main [README](../README.md) for how to run it.

## Assembly steps

1. **Prepare the cart.** Decide how many compartments each drawer will have and set up the dividers. The two layouts used in the study are listed in [`study-materials/`](../study-materials/README.md).
2. **Prepare the LED lights.** Insert batteries, then use the remote to check that each light turns on and to set its colour to light blue.
3. **Attach the drawer lights.** Tape one light to the front of each drawer with Gorilla Tape, where it is easy to see from standing height.
4. **Attach the compartment lights.** Tape one light inside each compartment, positioned so it is visible when the drawer is opened and does not block the items.
5. **Mount the speaker.** Place the Bluetooth speaker on the top surface of the cart and pair it with the laptop (or Raspberry Pi). Set it as the default audio output.
6. **Place the screen.** Put the laptop on or next to the cart where the user can see it while facing the drawers.
7. **Stock the cart and update the inventory file.** Put each item in its compartment and make sure `backend/inventory-<cart>.json` lists the same drawer and compartment for every item. If you change the layout, also record new speech clips and add drawer images (see "Adapting CueBot to your own cart" in the main README).
8. **Test each cue.** Search for one item from every drawer and check that the screen and speech point to the same place. Then have the operator switch on the lights for the same items with the remote and check that they match.
9. **Check the batteries before each session.** Dim lights are easy to miss, so replace batteries when the lights start to fade.
