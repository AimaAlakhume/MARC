# MARC Hardware Build Guide

MARC is built from inexpensive, off-the-shelf parts and needs no soldering or wiring. This guide lists the parts, explains how they fit together, and describes how to swap the laptop for a Raspberry Pi if you want a self-contained cart.

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
| **Total** | | | **$658**, plus tape and batteries |

**How many LED lights you need.** You need one light inside each compartment and one on the outside of each drawer. For the layperson cart in the study (five drawers with 4, 6, 8, 6, and 4 compartments), that is 28 + 5 = 33 lights. The study used four 10-packs (40 lights). For another layout, add up the compartments, add the number of drawers, and round up to the next 10-pack.

**LED requirements if you choose a different product.** The lights must be battery powered, so the cart needs no wiring, and remote controlled, so the operator can switch them on from out of view. They must also be small enough to fit inside a compartment. The study used light-blue lights.

**Optional, for a self-contained cart:** a Raspberry Pi 4B (about $45) with a small screen and keyboard can replace the laptop. The web interface runs in any modern browser, so no code changes are needed.

## How the parts fit together

MARC has three communication channels. Each one uses different hardware.

**1. LED indicators (non-verbal cues)**

Each drawer has an LED light on the outside of the cart, and each compartment has an LED light inside its drawer. The drawer light shows the user which drawer to open, and the compartment light shows exactly where the item is inside it. In the study, the lights for all of a condition's target items came on at the same time, so users could see every drawer they needed at once.

The lights run on their own batteries and are not connected to the MARC software. In the study, a hidden Wizard-of-Oz operator switched them on with the lights' remote control.

**Lighting only the lights you want.** One remote controls every light in a pack, so the study used each light's twist-on cover as an on/off switch. When a light's cover is twisted tight, the light is connected and responds to the remote. When the cover is twisted loose, the light is disconnected and stays off no matter what the remote does. Before each LED condition, the covers were tightened on the lights for that condition's target drawers and compartments and loosened on all the others. At the start cue, one press of the remote then switched on every target light at once, and no others. This kept the LED cues independent of any sensing or detection errors. A future autonomous version could replace the remote-controlled lights with LEDs driven by the backend.

**2. Speaker (verbal cues)**

The Bluetooth speaker sits on the top surface of the cart and is paired with the laptop. When the web interface locates an item, it plays a short speech clip through the laptop's audio output, which is the speaker. Each clip follows the same template: "Located in drawer {drawer}, compartment {compartment}."

The clips are pre-generated text-to-speech recordings, one per compartment, stored in `backend/public/audio-layperson/` and `backend/public/audio-rn/`. The file name gives the location, so `2-3.mp3` says "Located in drawer two, compartment three."

The clips were generated with a free online text-to-speech tool. Any text-to-speech tool that exports MP3 will work.

**3. Screen (web interface)**

The laptop displays the web interface next to the cart. See the main [README](../README.md) for how to run it.

## Assembly steps

1. **Prepare the cart.** Decide how many compartments each drawer will have and set up the dividers. The two layouts used in the study are listed in [`study-materials/`](../study-materials/README.md).
2. **Attach the drawer lights.** Tape one light to the front of each drawer with Gorilla Tape, where it is easy to see from standing height.
3. **Attach the compartment lights.** Tape one light inside each compartment, positioned so it is visible when the drawer is opened and does not block the items.
4. **Mount the speaker.** Place the Bluetooth speaker on the top surface of the cart and pair it with the laptop (or Raspberry Pi). Set it as the default audio output.
5. **Place the screen.** Put the laptop on or next to the cart where the user can see it while facing the drawers.
6. **Stock the cart and update the inventory file.** Put each item in its compartment and make sure `backend/inventory-<cart>.json` lists the same drawer and compartment for every item. If you change the layout, also record new speech clips and add drawer images (see "Adapting MARC to your own cart" in the main README).
7. **Test each cue.** Search for one item from every drawer and check that the screen and speech point to the same place. Then tighten the covers for those items' lights, loosen all the others, press the remote, and check that only the right lights come on.
8. **Check the batteries before each session.** Dim lights are easy to miss, so replace batteries when the lights start to fade.