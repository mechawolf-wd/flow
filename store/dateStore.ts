export const dateStore: Store = ({ ref }) => {
    const currentDate = ref(new Date())

    setInterval(() => {
        currentDate.value = new Date()
    }, 1000)

    return {
        currentDate,
    }
}
