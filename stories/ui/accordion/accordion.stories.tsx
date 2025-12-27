import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Accordion from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Accordion />,
};

export const Example: Story = {
  render: () => <Accordion />,
  parameters: {
    docs: {
      description: {
        story: 'An accordion component that displays collapsible sections for HTML, CSS, and JavaScript information.',
      },
    },
  },
};
