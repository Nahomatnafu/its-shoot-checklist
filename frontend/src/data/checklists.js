const checklists = {
  teleprompter: {
    title: "A-Roll Shoot (Teleprompter/Talking Heads)",
    categories: [
      {
        name: "Camera",
        items: [
          { name: "Black Magic w/Charger", optional: false },
          { name: "GoPro 12 w/Stand & Charger", optional: true },
        ],
      },
      {
        name: "Tripod",
        items: [
          { name: "Manfrotto - Spreader Component w/Plate", optional: false },
        ],
      },
      {
        name: "Camera - Additional",
        items: [
          { name: "Memory Cards (Formatted)", optional: false },
          { name: "Camera Mount Directional Microphone", optional: false },
          { name: "Cage Accessories and Multi-tool", optional: false },
        ],
      },
      {
        name: "Lighting",
        items: [
          { name: "Falcon Lights (x2)", optional: false },
          { name: "Nanlite Forza S5 60B", optional: false },
          { name: "GVM Lights (x2)", optional: false },
          { name: "Additional GVM Stand", optional: true },
          { name: "Circular Softbox Cover", optional: false },
          { name: "Impact Light Stand (x2)", optional: false },
          { name: "Additional GVM Stand", optional: true },
          { name: "C-Stand - Turtle Base Model", optional: false },
        ],
      },
      {
        name: "Lens",
        items: [{ name: "Sigma 18-35 (Black Magic)", optional: false }],
      },
      {
        name: "Audio",
        items: [
          {
            name: "RODE Wireless Microphone System (Lavalier System)",
            optional: false,
          },
          { name: "Zoom H6 (Recorder/Mixer) w/Charger", optional: false },
          { name: "Tascam w/AAA Batteries", optional: false },
          { name: "RODE Shotgun Microphone", optional: false },
          { name: "RODE Shotgun Stand (Auray)", optional: false },
          { name: "Headphones", optional: false },
          { name: "Batteries AA Rechargeable (Charged)", optional: false },
          { name: "XLR Cables (2 Minimum)", optional: false },
          { name: "Sound Blanket", optional: true },
        ],
      },
      {
        name: "Additional Items",
        items: [
          { name: "Extension Cords", optional: false },
          { name: "Toolbox", optional: false },
          { name: "Clapperboard & Marker", optional: false },
          { name: "Color Board", optional: false },
          { name: "Sandbags", optional: false },
        ],
      },
      {
        name: "Teleprompter Specific Items",
        items: [
          { name: "Teleprompter Glide Gear", optional: false },
          { name: "iPad & Script Ready (Prompt Start - Pro)", optional: false },
        ],
      },
      {
        name: "Documentation",
        items: [
          { name: "Video/Photography In-Progress Signage", optional: false },
          { name: "Image Release Waivers", optional: false },
          { name: "Paper Copies of Script", optional: false },
          { name: "Pens", optional: false },
        ],
      },
    ],
  },

  documentary: {
    title: "A-Roll & B-Roll Shoot (Documentary Style)",
    categories: [
      {
        name: "Camera",
        items: [
          { name: "Black Magic w/Charger", optional: false },
          { name: "Lumix S1H w/Charger", optional: false },
          { name: "Canon EOS R5 C", optional: true },
          { name: "GoPro 12 w/Stand & Charger", optional: true },
        ],
      },
      {
        name: "Tripod",
        items: [
          { name: "Manfrotto - Spreader Component w/Plate", optional: false },
          { name: "Manfrotto 055 - 502AH Head w/Plate", optional: false },
          { name: "Takama 3300", optional: true },
        ],
      },
      {
        name: "Camera - Additional",
        items: [
          { name: "Memory Cards (Formatted)", optional: false },
          { name: "Camera Mount Directional Microphone (x2)", optional: false },
          { name: "Lumix Batteries (x2)", optional: false },
          { name: "Canon Batteries (x3)", optional: true },
          { name: "Cage Accessories and Multitool", optional: false },
          { name: "Ninja Atomos w/Charger", optional: false },
        ],
      },
      {
        name: "Lighting",
        items: [
          { name: "Falcon Lights (x2)", optional: false },
          { name: "Nanlite Forza S5 60B", optional: false },
          { name: "GVM Lights (x2)", optional: false },
          { name: "Additional GVM Stand", optional: true },
          { name: "Circular Softbox Cover", optional: false },
          { name: "Impact Light Stand (x2)", optional: false },
          { name: "C-Stand - Turtle Base Model", optional: false },
        ],
      },
      {
        name: "Lens",
        items: [
          { name: "Sigma 18-35mm (Black Magic)", optional: false },
          { name: "Lumix 24-70mm", optional: false },
          { name: "Lumix Sigma 16 mm", optional: true },
          { name: "Canon 15-35mm RF", optional: true },
          { name: "Canon Tokina 11-16mm EF", optional: true },
          { name: "Canon 24-70mm RF", optional: true },
          { name: "Circular Polarizer Filter 82mm", optional: false },
        ],
      },
      {
        name: "Audio",
        items: [
          {
            name: "RODE Wireless Microphone System (Lavalier System)",
            optional: false,
          },
          {
            name: "Zoom H6 (Recorder/Mixer) w/Charger + Adapter",
            optional: false,
          },
          { name: "Tascam w/AAA Batteries", optional: false },
          { name: "RODE Shotgun Microphone", optional: false },
          { name: "RODE Shotgun Stand (Auray)", optional: false },
          { name: "Headphones & Splitter", optional: false },
          { name: "Batteries AA Rechargeable (Charged)", optional: false },
          { name: "XLR Cables (2 Minimum)", optional: false },
          { name: "Boom Microphone and Pole", optional: true },
        ],
      },
      {
        name: "Additional Items",
        items: [
          { name: "Extension Cords", optional: false },
          { name: "Toolbox", optional: false },
          { name: "Clapperboard & Marker", optional: false },
          { name: "Color Board", optional: false },
          { name: "Sandbags", optional: false },
          { name: "iPad", optional: false },
        ],
      },
      {
        name: "Batteries",
        items: [
          { name: "Edge Powerhouse", optional: false },
          {
            name: "Rechargeable Battery Packs (All Available)",
            optional: false,
          },
        ],
      },
      {
        name: "Documentation",
        items: [
          { name: "Video/Photography In-Progress Signage", optional: false },
          { name: "Image Release Waivers", optional: false },
          { name: "Pens", optional: false },
        ],
      },
    ],
  },

  broadcast: {
    title: "A-Roll Shoot (Broadcast Style)",
    categories: [
      {
        name: "Camera",
        items: [
          { name: "Canon EOS R5 C", optional: false },
          { name: "Lumix S1H", optional: true },
          { name: "GoPro 12 w/Stand & Charger", optional: true },
        ],
      },
      {
        name: "Tripod",
        items: [
          { name: "Manfrotto - Spreader Component w/Plate", optional: false },
        ],
      },
      {
        name: "Camera - Additional",
        items: [
          { name: "Memory Cards (Formatted)", optional: false },
          { name: "Camera Mount Directional Microphone", optional: false },
          { name: "Canon Batteries (x3)", optional: false },
          { name: "Lumix Batteries (x2)", optional: true },
          { name: "Cage Accessories and Multitool", optional: false },
          { name: "Ninja Atomos w/Charger", optional: true },
        ],
      },
      {
        name: "Lighting",
        items: [
          { name: "Falcon Lights (x2)", optional: false },
          { name: "Nanlite Forza S5 60B", optional: false },
          { name: "GVM Lights (x2)", optional: false },
          { name: "Circular Softbox Cover", optional: false },
          { name: "Impact Light Stand (x2)", optional: false },
          { name: "CC Stand - Turtle Base Model", optional: false },
        ],
      },
      {
        name: "Lens",
        items: [
          { name: "Canon 15-35mm RF", optional: false },
          { name: "Canon 24-70mm RF", optional: false },
          { name: "Canon Tokina 11-16mm EF", optional: true },
          { name: "Lumix 24-70mm", optional: true },
          { name: "Lumix Sigma 16 mm", optional: true },
          { name: "Circular Polarizer Filter 82mm", optional: false },
        ],
      },
      {
        name: "Audio",
        items: [
          { name: "Wireless Handheld Condenser Microphone", optional: false },
          {
            name: "Zoom H6 (Recorder/Mixer) w/Charger + Adapter",
            optional: false,
          },
          { name: "RODE Shotgun Microphone", optional: false },
          { name: "RODE Shotgun Stand (Auray)", optional: false },
          {
            name: "RODE Wireless Microphone System (Lavalier System)",
            optional: true,
          },
          { name: "Boom Microphone & Pole", optional: true },
          { name: "Headphones", optional: false },
          { name: "Batteries AA Rechargeable (Charged)", optional: false },
          { name: "XLR Cables (2 Minimum)", optional: false },
        ],
      },
      {
        name: "Additional Items",
        items: [
          { name: "Extension Cords", optional: false },
          { name: "Toolbox", optional: false },
          { name: "Clapperboard & Marker", optional: false },
          { name: "Color Board", optional: false },
          { name: "Sandbags", optional: false },
          { name: "iPad", optional: false },
        ],
      },
      {
        name: "Batteries",
        items: [
          { name: "Edge Powerhouse", optional: false },
          {
            name: "Rechargeable Battery Packs (All Available)",
            optional: false,
          },
        ],
      },
      {
        name: "Documentation",
        items: [
          { name: "Video/Photography In-Progress Signage", optional: false },
          { name: "Image Release Waivers", optional: false },
          { name: "Paper copies of script", optional: false },
          { name: "Pens", optional: false },
        ],
      },
      {
        name: "Broadcast Specific Items",
        items: [
          { name: "Handheld Microphone w/Square Flag", optional: false },
          { name: "Ronin S Gimbal", optional: true },
        ],
      },
    ],
  },

  photoshoot: {
    title: "Photoshoot",
    categories: [
      {
        name: "Camera",
        items: [
          { name: "Canon EOS 6D", optional: false },
          { name: "Canon R5C", optional: false },
          {
            name: "GoPro 12 w/Stand & Charger (Behind-the-Scenes)",
            optional: false,
          },
        ],
      },
      {
        name: "Camera - Additional",
        items: [
          { name: "Memory Cards (Formatted)", optional: false },
          { name: "Canon Batteries (x3)", optional: false },
          { name: "Cage Accessories and Multitool", optional: false },
        ],
      },
      {
        name: "Lighting",
        items: [
          { name: "Falcon Lights (x2)", optional: false },
          { name: "Nanlite Forza S5 60B", optional: false },
          { name: "GVM LED Light Panels (x2)", optional: false },
          { name: "Additional GVM Stand", optional: true },
          { name: "Gordox Rectangular Softbox", optional: false },
          { name: "Impact Light Stand (x2)", optional: false },
          { name: "C-Stand - Turtle Base Model", optional: false },
        ],
      },
      {
        name: "Lens",
        items: [
          { name: "Canon 50mm EF (Fabio’s)", optional: false },
          { name: "Canon Tokina 11-16mm EF", optional: true },
          { name: "Canon 24-70mm RF", optional: false },
          { name: "Drop-In Filter Mount Adapter (EF to RF)", optional: false },
        ],
      },
      {
        name: "Batteries",
        items: [
          { name: "Edge Powerhouse", optional: false },
          {
            name: "Rechargeable Battery Packs (All Available)",
            optional: false,
          },
        ],
      },
      {
        name: "Tripod",
        items: [
          { name: "Manfrotto - 1906B Model (Fabio's)", optional: false },
          { name: "Takama 3300 (GoPro)", optional: false },
        ],
      },
      {
        name: "Additional Items",
        items: [
          { name: "Extension Cords", optional: false },
          { name: "Toolbox", optional: false },
          { name: "Clapperboard & Marker", optional: false },
          { name: "Fluorescent ProTape", optional: false },
          { name: "Sandbags", optional: false },
          { name: "iPad", optional: false },
        ],
      },
      {
        name: "Photoshoot Specific Items",
        items: [
          { name: "Posing Stool", optional: false },
          { name: "Mirror", optional: false },
          { name: "Props (Specific to Shoot)", optional: false },
          { name: "Backdrop (Grey and/or Green Screen)", optional: false },
          { name: "Impact - BGS-S12-V2 (Backdrop Stands)", optional: false },
        ],
      },
      {
        name: "Documentation",
        items: [
          { name: "Copies of Poses (x4)", optional: false },
          { name: "Video/Photography In-Progress Signage", optional: false },
          { name: "Exit Sign", optional: false },
          { name: "Image Release Waivers", optional: false },
          { name: "Pens", optional: false },
        ],
      },
    ],
  },

  coverage: {
    title: "B-Roll Shoot (Coverage Footage)",
    categories: [
      {
        name: "Camera",
        items: [
          { name: "Canon EOS R5 C", optional: false },
          { name: "Lumix S1H", optional: false },
          { name: "GoPro 12 w/Stand & Charger", optional: true },
        ],
      },
      {
        name: "Tripod",
        items: [
          { name: "Manfrotto - Spreader Component w/Plate", optional: false },
          { name: "Ronin S Gimbal", optional: true },
        ],
      },
      {
        name: "Camera - Additional",
        items: [
          { name: "Memory Cards (Formatted)", optional: false },
          { name: "Camera Mount Directional Microphone (x2)", optional: false },
          { name: "Canon Batteries (x3)", optional: false },
          { name: "Lumix Batteries (x2)", optional: false },
          { name: "Cage Accessories and Multitool", optional: false },
          { name: "Ninja Atomos w/Charger", optional: false },
        ],
      },
      {
        name: "Lighting",
        items: [
          { name: "Falcon Lights (x2)", optional: false },
          { name: "Nanlite Forza S5 60B", optional: false },
          { name: "GVM Lights (x2)", optional: false },
          { name: "Additional GVM Stand", optional: true },
          { name: "Circular Softbox cover", optional: false },
          { name: "Impact Light Stand (x2)", optional: false },
          { name: "C-Stand - Turtle Base Model", optional: false },
        ],
      },
      {
        name: "Lens",
        items: [
          { name: "Canon 50mm EF (Fabio’s)", optional: false },
          { name: "Canon 15-35mm RF", optional: false },
          { name: "Canon 24-70mm RF", optional: false },
          { name: "Canon 70-200mm EF", optional: false },
          { name: "Canon Tokina 11-16mm EF", optional: true },
          { name: "Lumix 24-70mm", optional: false },
          { name: "Lumix Sigma 16 mm", optional: true },
          { name: "Drop-In Filter Mount Adapter (EF to RF)", optional: false },
          { name: "Circular Polarizer Filter 82mm", optional: false },
        ],
      },
      {
        name: "Batteries",
        items: [
          { name: "Edge Powerhouse", optional: false },
          { name: "Rechargeable Battery Packs (All Available)", optional: false },
        ],
      },
      {
        name: "Additional Items",
        items: [
          { name: "Extension Cords", optional: false },
          { name: "Toolbox", optional: false },
          { name: "iPad", optional: false },
          { name: "Color Board", optional: false },
          { name: "Sandbags (Lighting)", optional: false },
        ],
      },
      {
        name: "Documentation",
        items: [
          { name: "Video/Photography In-Progress Signage", optional: false },
          { name: "Image Release Waivers", optional: false },
          { name: "Pens", optional: false },
        ],
      },
    ],
  },
  
};

export default checklists;
