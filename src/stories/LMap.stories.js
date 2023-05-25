import { LMap } from './LMap';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Example/LMap',
  component: LMap,
  tags: ['autodocs'],
  argTypes: {
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'LMap',
  },
};

export const Secondary = {
  args: {
    label: 'LMap',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'LMap',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'LMap',
  },
};
