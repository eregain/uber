export default function NotFoundScreen() {
  return (
      <>
        <Stack.Screen options={{ title: "Oops!" }} />
        <View style={styles.container}>
          <Text>This screen doesn't exist.</Text>
          <Link href="/" style={styles.link}>
            <Text>Go to home screen!</Text>
          </Link>
        </View>
      </>
  );
}