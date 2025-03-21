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
    padding: 10,
    backgroundColor: '#e0e7ff',
    borderRadius: 25,
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
    top: 20,
    left: 20,
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
    top: 20,
    right: '10%',
    fontSize: 80,
    fontWeight: 'bold',
    color: 'black'
  },
  movingWord: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
  },
  character: {
    position: "absolute",
    left: 100,
    backgroundColor: "transparent",
    overflow: "hidden", // Ensures only one frame is visible
  },
  background: {
    position: 'absolute',
    resizeMode: 'stretch',
    bottom: 0
  }
});
