import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { useAPIEventListener, AppEvents } from "@remnote/plugin-sdk";

async function onActivate(plugin: ReactRNPlugin) {

  console.log("Hello from my RemNote plugin!");
  await plugin.app.registerCSS("hide-hello-css", `
    .rem-text span[data-key="hello"] {
      display: none;
    }
  `);

  plugin.event.addListener(AppEvents.RemChanged, undefined, async (remId) => {
    console.log("useAPIEventListener");
    const rem = await plugin.rem.findOne(remId);
    const text = rem?.text;
    if (!text) return;
    const updatedText = text.map((richText) => {
      console.log("richtext");
      if (typeof richText === "string") {
        console.log("richtext woo its string");
        const words = richText.split(" ");
        const newText = words.map((word) => {
          console.log("new word here");
          if (word.toLowerCase() === "hello") {
            return { text: word, i: "hello", "data-key": "hello" };
          }
          return word;
        });
        
        return newText.join("*");
      }
      return richText;
    });
  
    await rem.setText(updatedText);
  });

  // Register settings
  await plugin.settings.registerStringSetting({
    id: 'name',
    title: 'What is your Ohhh fuckk ukk?',
    defaultValue: 'Fuck',
  });

  await plugin.settings.registerBooleanSetting({
    id: 'pizza',
    title: 'Do you like pizza?',
    defaultValue: true,
  });

  await plugin.settings.registerNumberSetting({
    id: 'favorite-number',
    title: 'What is your favorite number?',
    defaultValue: 42,
  });

  // A command that inserts text into the editor if focused.
  await plugin.app.registerCommand({
    id: 'editor-command',
    name: 'Editor Command',
    action: async () => {
      plugin.editor.insertPlainText('Hello World!');
    },
  });

  // Show a toast notification to the user.
  await plugin.app.toast("Okkkaaasssss!");

  // Register a sidebar widget.
  await plugin.app.registerWidget('sample_widget', WidgetLocation.RightSidebar, {
    dimensions: { height: 'auto', width: '100%' },
  });


}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
