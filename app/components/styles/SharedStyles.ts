import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  practiceContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    gap: 15,
  },
  wordCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#d1d5db',
    borderRadius: 5,
  },
  completedDot: {
    backgroundColor: '#6366f1',
  },
  audioButton: {
    width: 60, // Larger button size
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30, // Circular button
    backgroundColor: 'transparent', // Remove background color
    borderWidth: 2,
    borderColor: '#ffffff', // Add a white border for visibility
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 140,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  newProfileTitle: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: '600'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarButton: {
    marginHorizontal: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  selectedAvatar: {
    borderColor: 'blue',
    borderWidth: 2
  },
  avatarImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16
  },
  levelsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2'
  },
  levelsListContainer: {
    paddingBottom: 16
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '500'
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    position: 'absolute',
    top: '5%', // Converted from 20
    left: '5%', // Converted from 20
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  gameWord: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'black',
  },
  score: {
    position: 'absolute',
    top: '5%', // Converted from 20
    right: '10%', // Converted from 10%
    fontSize: 80,
    fontWeight: 'bold',
    color: 'black',
  },
  movingWord: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center', // Ensure proper alignment
  },
  character: {
    position: "absolute",
    left: '10%', // Converted from 100
    backgroundColor: "transparent",
    overflow: "hidden", // Ensures only one frame is visible
  },
  background: {
    position: 'absolute',
    resizeMode: 'stretch',
    bottom: '0%', // Converted from 0
  },
  sentence: {
    fontSize: 60,
    color: 'white',
  },
  sentenceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: 20,
  },
  errorText: {
    position: 'absolute',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'red',
    top: '50%', // Converted from an approximate center position
    left: '10%', // Converted from an approximate left position
  },
  practiceWord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  wordTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  practiceWordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  wordPartWrapper: {
    position: 'relative', // Ensure the overlay is positioned relative to the text
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordPartsContainer: {
    flexDirection: 'row', // Lay out parts horizontally
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allow it to take up available space
  },
  wordPart: {
    width: 40, // Fixed width for each part
    height: 60, // Fixed height for each part
    marginHorizontal: 2, // Small spacing between parts
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  wordPartTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordPartText: {
    fontSize: 60, // Font size for the text inside parts
    fontWeight: 'bold',
    color: '#f3f4f6', // Default off-white
    textAlign: 'center',
  },
  mainText: {
    fontSize: 32, // Adjust font size for word parts
    fontWeight: 'bold',
    color: '#333333', // Default off-white
    textAlign: 'center',
  },
  practiceWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#858585', // Dark gray background
    paddingVertical: 20, // Keep vertical padding
    paddingLeft: 20, // Keep left padding for space before word
    paddingRight: 10, // Reduce right padding to be closer to button
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative', // Needed for absolute positioning of the overlay
  },
  panOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, // Cover the entire parent container
    bottom: 0,
    backgroundColor: 'transparent', // Make it invisible
    zIndex: 1, // Ensure it's above the text container but below the button if needed
  },
  speechButtonWrapper: {
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    marginRight: 10, // Push the button slightly left
  },
  speechButton: {
    fontSize: 40,
    textAlign: 'right',
    alignContent: 'center'
  }
});
