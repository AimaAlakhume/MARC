# CueBot Hardware Build Guide

CueBot is built from off-the-shelf parts and needs no soldering or wiring. The complete platform used in the study cost **$738**. This guide lists the parts, explains how they fit together, and describes how to swap the laptop for a Raspberry Pi if you want a self-contained cart.

## Parts list

| Part | What it does | Link | Cost (USD) |
|---|---|---|---|
| Mobile emergency cart with drawers and dividers | The storage cart CueBot is built on | [Amazon](https://www.amazon.com/dp/B0D6GHMDFJ) | $580 |
| Battery-powered, remote-controlled LED lights | Cues on each drawer front and inside each compartment | [Amazon](https://www.amazon.com/dp/B0H98QLLHJ) | Included below |
| Bluetooth speaker | Plays the speech cues | [Amazon](https://www.amazon.com/dp/B07N985DN9) | Included below |
| Batteries and strong adhesive tape (e.g. Gorilla Tape) | Power and mount the lights | Any brand | Included below |
| **Lights, speaker, and mounting supplies (subtotal)** | | | **$158** |
| Laptop | Runs the web interface and plays audio | Existing lab hardware | No added cost |
| **Total** | | | **$738** |

The specific light brand does not matter. Any small LED lights will work as long as they are **battery-powered** and **remote-controlled**. Prices change over time, so the costs above reflect what we paid.

**Optional, for a self-contained cart:** a Raspberry Pi 4B (about $45) with a small screen and keyboard can replace the laptop. The web interface runs in any modern browser, so no code changes are needed.

## How the parts fit together

CueBot has three communication channels. Each one uses different hardware.

**1. LED lights (non-verbal cues)**

One light is attached to the front of each drawer, and one light is attached inside each compartment. When an item is requested, the light on the correct drawer shows the user which level to open. Once the drawer is open, the light in the correct compartment shows exactly where the item is. The lights run on batteries and are held in place with adhesive tape, so no wiring is needed.

The lights are not connected to the CueBot software. In the study, a hidden Wizard-of-Oz operator switched on the lights for each item using their remote controls. This kept the light cues independent of any sensing or detection errors. A future autonomous version could replace the remote-controlled lights with lights driven by the backend.

**2. Speaker (verbal cues)**

The Bluetooth speaker sits on the top surface of the cart and is paired with the laptop. When the web interface locates an item, it plays a short speech clip through the laptop's audio output, which is the speaker. Each clip follows the same template: "Located in drawer {drawer}, compartment {compartment}."

The clips are pre-generated text-to-speech recordings, one per compartment, stored in `backend/public/audio-layperson/` and `backend/public/audio-rn/`. The file name gives the location, so `2-3.mp3` says "Located in drawer two, compartment three."

<!-- FILL IN: name the text-to-speech tool and voice used to generate the clips. -->

**3. Screen (web interface)**

The laptop displays the web interface next to the cart. See the main [README](../README.md) for how to run it.

## Assembly steps

1. **Prepare the cart.** Decide how many compartments each drawer will have and set up the dividers. The two layouts used in the study are listed in [`study-materials/`](../study-materials/README.md).
2. **Prepare the lights.** Put batteries in every light and check that each one turns on and off with its remote. If the lights have a colour setting, choose one colour for all of them (the study used light blue).
3. **Mount the drawer lights.** Tape one light to the front of each drawer where it is easy to see from standing height.
4. **Mount the compartment lights.** Tape one light inside each compartment, positioned so it is visible when the drawer is opened and does not block the items.
5. **Label the remotes.** Mark which remote (or remote button) controls which drawer or compartment light, so the operator can find the right one quickly during a session.
6. **Mount the speaker.** Place the Bluetooth speaker on the top surface of the cart and pair it with the laptop (or Raspberry Pi). Set it as the default audio output.
7. **Place the screen.** Put the laptop on or next to the cart where the user can see it while facing the drawers.
8. **Stock the cart and update the inventory file.** Put each item in its compartment and make sure `backend/inventory-<cart>.json` lists the same drawer and compartment for every item. If you change the layout, also record new speech clips and add drawer images (see "Adapting CueBot to your own cart" in the main README).
9. **Test each cue.** Search for one item from every drawer and check that the screen and speech point to the same place. Then have the operator switch on the lights for the same items and check that they match.

## Tips

- Keep spare batteries on hand. Lights that dim partway through a session are harder to notice.
- Test the remotes from where the operator will sit. Some remotes need a clear line of sight to the light.
