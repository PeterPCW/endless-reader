import React from 'react';
import { View, ViewProps } from 'react-native';

export const ThemedView: React.FC<ViewProps> = ({ children, style, ...props }) => {
  return (
    <View style={[{ flex: 1, backgroundColor: '#fff' }, style]} {...props}>
      {children}
    </View>
  );
};
