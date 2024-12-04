import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { ImagePickerHandler } from './HelperFunctions';

const { width } = Dimensions.get('window');

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
    gray: 'gray',
    gold: 'gold',
    postBackground: '#c2d1c6',
};

const Padding = {
    negative: -10,
    zero: 0,
    xsmall: 2,
    small: 5,
    medium: 8,
    mediumLarge: 15,
    large: 10,
    xlarge: 20,
    xxlarge: 30,
    header: 80,
    postIcon: 185,
};

const Font = {
    sizeSmall: 12,
    sizeMedium: 16,
    sizeLarge: 20,
    sizeXLarge: 24,
    sizeXXLarge: 30,
    weight: 'bold',
};

const BorderWidth = {
    thin: 1,
    medium: 2,
    thick: 4,
    dashed: 'dashed',
};

const BorderRadius = {
    small: 5,
    smallMedium: 8,
    medium: 10,
    large: 20,
    xlarge: 30,
    xxlarge: 40,
    xxxlarge: 50,
};

const ContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    alignItems: 'center',
    addImageWidth: width / 3 - 20,
    alignLeft: 'flex-start',
};

const Width = {
    xsmall: '31%',
    small: '35%',
    smallMedium: '60%',
    medium: '85%',
    large: '100%',
    border: 350,
    Image: 100,
    ImageLarge: 160,
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

const Align = {
    center: 'center',
    left: 'left',
    right: 'right',
    top: 'top',
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

const Resize = {
    cover: 'cover',
}

const Height = {
    input: 40,
    suggestionContainer: 150,
    image: 30,
    postImage: 180,
};

const Stylings = {
    label: {
        fontSize: Font.sizeMedium,
        marginBottom: Padding.medium,
        color: Colors.black,
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
        fontSize: Font.sizeXLarge,
        fontWeight: Font.weight,
    },
    image: {
        width: ContainerStyle.addImageWidth,
        height: Width.Image,
        borderRadius: BorderRadius.smallMedium,
        margin: Margin.xsmall,
        justifyContent: Align.center,
        alignItems: ContainerStyle.alignItems
    },
    imageWrapper: {
        position: 'relative',
        margin: Margin.xsmall,
    },
    deleteButton: {
        position: Position.absolute,
        top: Padding.small,
        right: Padding.small,
        backgroundColor: Colors.tertiary,
        borderRadius: BorderRadius.xxxlarge,
        padding: Padding.xsmall,
        elevation: 3,
    },
    suggestionsContainer: {
        maxHeight: Height.suggestionContainer,
        backgroundColor: Colors.noColor,
        marginHorizontal: Padding.xlarge,
        borderColor: Colors.gray,
        borderWidth: BorderWidth.thin,
        borderRadius: BorderRadius.small,
        marginTop: -Padding.xlarge,
        backgroundColor: '#fff',
        zIndex: 1,
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
    button: {
        flex: ContainerStyle.flex,
        alignItems: Align.center,
    },
};

export { Colors, Padding, Font, BorderWidth, BorderRadius, ContainerStyle, Width, Margin, Align, Position, Icon, Opacity, ButtonStyle, Resize, Height, Stylings };
