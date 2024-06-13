export const dateStore = ({ ref }: any) => {
    const currentDate = ref(new Date())

    setInterval(() => {
        currentDate.value = new Date()
    }, 1000)

    return {
        currentDate,
    }
}
