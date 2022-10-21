import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';

import ChannelCapacity from './components/ChannelCapacity/ChannelCapacity';
const PLUGIN_NAME = 'ChannelCapacityV2Plugin';

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

    flex.WorkerCanvas.Content.add( <ChannelCapacity key = "channel-capacity" />)

  }
}
