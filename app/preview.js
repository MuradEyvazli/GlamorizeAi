import { addDecorator } from '@storybook/react'; // Correct import
import { AuthProvider } from '../path-to-your-auth-provider'; // Adjust the path accordingly

// Wrap all stories with the AuthProvider to ensure session handling in stories
addDecorator((story) => <AuthProvider>{story()}</AuthProvider>);
