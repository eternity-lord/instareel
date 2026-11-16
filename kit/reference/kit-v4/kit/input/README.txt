HOW TO GIVE SCENES (this folder is the only thing the owner edits)

1) input/scenario.json  -> list of scenes. Minimum per scene: {"id":"any-slug","text":"Persian caption/line"}.
   Optional: "idea" (free text: what happens), "mood", "sfx":[{"k":"pop|whoosh|chime|tick|error","t":seconds}], "words" (manual timing), "dur".
   Optional top level: "cast" (characters), "title".
2) input/refs/          -> drop a reference video and/or images. The agent studies them and matches the STYLE (see README).
3) input/post_copy.md   -> caption + hashtags.
Then run the agent: "Follow README.md and build the reel from input/."
