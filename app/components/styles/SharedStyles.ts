import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  // Common card style
  listContainer: {
    gap: 15,
  },
  // Common card style
  cardStyle: {
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
  // Common button style
  buttonStyle: {
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
    fontSize: 60,
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
    resizeMode: 'stretch'
  },
  foreground: {
    position: 'absolute',
    resizeMode: 'stretch',
    bottom: '0%'
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
    overflow: 'hidden',
  },
  foregroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    overflow: 'hidden',
  },
  sentence: {
    fontSize: 80,
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
  mainText: {
    fontSize: 32, // Adjust font size for word parts
    fontWeight: 'bold',
    color: '#333333', // Default off-white
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: '40%',
  },
  filterButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 4,
    width: '55%',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#333',
  },
  listsContainer: {
    paddingBottom: 16,
  },
  wordItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  wordsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: 14,
    color: '#666',
  },
  pauseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  pauseButtonText: {
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'red',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
  },
});
