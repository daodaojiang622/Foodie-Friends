import { FontAwesome5, MaterialIcons, Ionicons, FontAwesome6 } from '@expo/vector-icons';

const Colors = {
    primary: '#454580',
    secondary: 'orange',
    tertiary: 'white',

    background: '#edeffa',

    toggleThemeHeader: '#405c47',
    toggleThemeBackground: '#e9f5ec',

    noColor: 'transparent',

    dropDownColor: '#fafafa',

    inputBorder: 'black',
};

const Padding = {
    small: 5,
    medium: 8,
    large: 10,
    xlarge: 20,
    xxlarge: 30,
};

const Font = {
    sizeSmall: 12,
    sizeMedium: 16,
    SizeLarge: 24,
    weight: 'bold',
};

const BorderWidth = {
    thin: 1,
    medium: 2,
    thick: 4,
}; 

const BorderRadius = {
    small: 5,
    medium: 10,
    large: 20,
};

const ContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    alignItems: 'center',
};

const Width = {
    small: '35%',
    medium: '85%',
    large: '100%',
};

const Margin = {
    xsmall: 5,
    small: 8,
    medium: 15,
    large: 20,
    xlarge: 25,
    xxlarge: 30,
    xxxlarge: 120,
    xxxxlarge: 250,
    xxxxxlarge: 640,
};

const Image = {
    height: 25,
    width: 25,
};

const Align = {
    center: 'center',
    left: 'left',
    right: 'right',
};

const Position = {
    absolute: 'absolute',
};

const Icon = {
    activityIconComponent: FontAwesome5,
    activityIconName: 'running',
    dietIconComponent: MaterialIcons,
    dietIconName: 'fastfood',
    settingsIconComponent: Ionicons,
    settingsIconName: 'settings-sharp',
    addIconComponent: FontAwesome6,
    addIconName: 'add',
    deleteIconComponent: FontAwesome5,
    deleteIconName: 'trash-alt',
};

const Opacity = {
    opaque: 1,
    partialOpaque: 0.7,
};

const Button = {
    size: 20,
    buttonMarginTop: 300,
    buttonMarginHorizontal: 80,
}

export { Colors, Padding, Font, BorderWidth, BorderRadius, ContainerStyle, Width, Margin, Image, Align, Position, Icon, Opacity, Button};