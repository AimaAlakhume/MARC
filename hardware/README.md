# CueBot Hardware Build Guide

CueBot is built from inexpensive, off-the-shelf parts and needs no soldering or wiring. This guide lists the parts, explains how they fit together, and describes how to swap the laptop for a Raspberry Pi if you want a self-contained cart.

## Parts list

The specific products below are the ones used in the study. Any equivalent product will work.

| Part | Product used | Purpose | Approx. price (USD) |
|---|---|---|---|
| Mobile cart | [Medical rolling crash cart with wheels, CPR board, and IV pole](https://www.amazon.com/dp/B0D6GHMDFJ) (OLERN) | The storage cart the robot is built on | $550 |
| LED lights (4 packs) | [Mini submersible LED lights with remote, 10-pack](https://www.amazon.com/dp/B0CMZNDHL8) (Sunnyes) | Drawer and compartment indicators | $88 ($22 per pack) |
| Speaker | [Bluetooth 5.0 shower speaker](https://www.amazon.com/dp/B07N985DN9) (Johns Avenue) | Plays the speech cues | $20 |
| Mounting tape | Gorilla Tape | Attaches the LED lights to the cart | A few dollars |
| Batteries | Coin-cell batteries for the LED lights | Powers the LED lights | Varies |
| Laptop | Any laptop with a web browser | Runs the web interface and plays audio | Existing hardware |
| **Total** | | | **About $660**, plus tape and batteries |

**How many LED lights you need.** You need one light inside each compartment and one on the outside of each drawer. For the layperson cart in the study (five drawers with 4, 6, 8, 6, and 4 compartments), that is 28 + 5 = 33 lights. The study used four 10-packs (40 lights). For another layout, add up the compartments, add the number of drawers, and round up to the next 10-pack.

**LED requirements if you choose a different product.** The lights must be battery powered, so the cart needs no wiring, and remote controlled, so the operator can switch them on from out of view. They must also be small enough to fit inside a compartment. The study used light-blue lights.

**Optional, for a self-contained cart:** a Raspberry Pi 4B (about $45) with a small screen and keyboard can replace the laptop. The web interface runs in any modern browser, so no code changes are needed.

## How the parts fit together

CueBot has three communication channels. Each one uses different hardware.

**1. LED indicators (non-verbal cues)**

Each drawer has an LED light on the outside of the cart, and each compartment has an LED light inside its drawer. When an item is requested, the light on the correct drawer flashes to show the user which level to open. Once the drawer is open, the light in the correct compartment flashes to show exactly where the item is.

The lights run on their own batteries and are not connected to the CueBot software. In the study, a hidden Wizard-of-Oz operator switched them on with the lights' remote control.

**Lighting only the lights you want.** One remote controls every light in a pack, so the study used each light's twist-on cover as an on/off switch. When a light's cover is twisted tight, the light is connected and responds to the remote. When the cover is twisted loose, the light is disconnected and stays off no matter what the remote does. By loosening the covers of all lights except the target drawer and compartment, the operator could use one remote to light only those. This kept the LED cues independent of any sensing or detection errors. A future autonomous version could replace the remote-controlled lights with LEDs driven by the backend.

**2. Speaker (verbal cues)**

The Bluetooth speaker sits on the top surface of the cart and is paired with the laptop. When the web interface locates an item, it plays a short speech clip through the laptop's audio output, which is the speaker. Each clip follows the same template: "Located in drawer {drawer}, compartment {compartment}."

The clips are pre-generated text-to-speech recordings, one per compartment, stored in `backend/public/audio-layperson/` and `backend/public/audio-rn/`. The file name gives the location, so `2-3.mp3` says "Located in drawer two, compartment three."

The clips were generated with a free online text-to-speech tool. Any text-to-speech tool that exports MP3 will work.

**3. Screen (web interface)**

The laptop displays the web interface next to the cart. See the main [README](../README.md) for how to run it.

## Assembly steps

1. **Prepare the cart.** Decide how many compartments each drawer will have and set up the dividers. The two layouts used in the study are listed in [`study-materials/`](../study-materials/README.md).
2. **Prepare the LED lights.** Insert batteries, then use the remote to check that each light turns on and to set its colour to light blue. Check that twisting each cover loose turns that light off even when the remote is used.
3. **Attach the drawer lights.** Tape one light to the front of each drawer with Gorilla Tape, where it is easy to see from standing height.
4. **Attach the compartment lights.** Tape one light inside each compartment, positioned so it is visible when the drawer is opened and does not block the items.
5. **Mount the speaker.** Place the Bluetooth speaker on the top surface of the cart and pair it with the laptop (or Raspberry Pi). Set it as the default audio output.
6. **Place the screen.** Put the laptop on or next to the cart where the user can see it while facing the drawers.
7. **Stock the cart and update the inventory file.** Put each item in its compartment and make sure `backend/inventory-<cart>.json` lists the same drawer and compartment for every item. If you change the layout, also record new speech clips and add drawer images (see "Adapting CueBot to your own cart" in the main README).
8. **Test each cue.** Search for one item from every drawer and check that the screen and speech point to the same place. Then have the operator loosen every cover except the ones for those items, switch the lights on with the remote, and check that only the right lights come on.
9. **Check the batteries before each session.** Dim lights are easy to miss, so replace batteries when the lights start to fade.
