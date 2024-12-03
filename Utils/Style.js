import { FontAwesome5, MaterialIcons, Ionicons, FontAwesome6 } from '@expo/vector-icons';

const Colors = {
    primary: '#454580',
    secondary: 'orange',
    tertiary: 'white',
    background: '#edeef2',
    toggleThemeHeader: '#405c47',
    toggleThemeBackground: '#e9f5ec',
    noColor: 'transparent',
    dropDownColor: '#fafafa',
    inputBorder: 'black',
    greenPostColor: '#c2d1c6',
    postColor: '#d5d6db',
    borderColor: 'lightgray',
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
    SizeLarge: 20,
    SizeXLarge: 24,
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
    border: 350,
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
    settingsIconComponent: Ionicons,
    settingsIconName: 'settings-sharp',
    addIconComponent: Ionicons,
    addIconName: 'add-circle-outline',
    deleteIconComponent: FontAwesome5,
    deleteIconName: 'trash-alt',
};

const Opacity = {
    opaque: 1,
    partialOpaque: 0.7,
};

const ButtonStyle = {
    size: 20,
    buttonMarginTop: 300,
    buttonMarginHorizontal: 80,
};

const Stylings = {
    container: {
        flex: 1,
        padding: Padding.medium,
        justifyContent: Align.center,
    },
    label: {
        fontSize: Font.sizeMedium,
        marginBottom: Padding.medium,
        color: Colors.primary,
        fontWeight: Font.weight,
    },
    input: {
        borderWidth: BorderWidth.medium,
        borderColor: Colors.borderColor,
        padding: Padding.medium,
        borderRadius: BorderRadius.small,
        marginBottom: Padding.large,
        width: Width.border,
    },
    button: {
        padding: Padding.large,
        borderRadius: BorderRadius.medium,
        marginTop: Margin.xxxlarge,
        alignItems: Align.center,
    },
    buttonPressed: {
        opacity: Opacity.partialOpaque,
    },
    buttonText: {
        fontSize: Font.SizeLarge,
        fontWeight: Font.weight,
    },
    image: {
        width: Width.small,
        height: 100,
        resizeMode: 'cover',
        borderRadius: BorderRadius.small,
        margin: Padding.small,
    },
    imageWrapper: {
        margin: Padding.small,
        alignItems: Align.center,
    },
    deleteButton: {
        position: Position.absolute,
        top: Padding.small,
        right: Padding.small,
        backgroundColor: Colors.tertiary,
        borderRadius: BorderRadius.large,
        padding: Padding.small,
    },
    suggestionsContainer: {
        position: Position.absolute,
        zIndex: 10,
        backgroundColor: Colors.background,
        borderColor: Colors.inputBorder,
        borderWidth: BorderWidth.thin,
        borderRadius: BorderRadius.small,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    suggestionItem: {
        padding: Padding.large,
        borderBottomWidth: BorderWidth.thin,
        borderBottomColor: Colors.dropDownColor,
    },
    modalContainer: {
        flex: 1,
        justifyContent: Align.center,
        alignItems: Align.center,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.tertiary,
        borderRadius: BorderRadius.medium,
        padding: Padding.large,
        alignItems: Align.center,
    },
};

export { Colors, Padding, Font, BorderWidth, BorderRadius, ContainerStyle, Width, Margin, Image, Align, Position, Icon, Opacity, ButtonStyle, Stylings };
