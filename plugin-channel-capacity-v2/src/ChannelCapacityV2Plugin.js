import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import ChannelCapacity from './components/ChannelCapacity/ChannelCapacity';
import { PLUGIN_NAME } from './utils/constants';

export default class ChannelCapacityV2Plugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });
    flex.WorkerCanvas.Content.add( <ChannelCapacity key = "channel-capacity" />)

  }
}
