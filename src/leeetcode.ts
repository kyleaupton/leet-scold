export const didSubmitToday = async (username: string): Promise<boolean> => {
  const res = await fetch('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: '\n    query userProfileCalendar($username: String!, $year: Int) {\n  matchedUser(username: $username) {\n    userCalendar(year: $year) {\n      activeYears\n      streak\n      totalActiveDays\n      dccBadges {\n        timestamp\n        badge {\n          name\n          icon\n        }\n      }\n      submissionCalendar\n    }\n  }\n}\n    ',
      variables: {
        username
      },
      operationName: 'userProfileCalendar'
    })
  })

  if (res.status !== 200) {
    return false
  }

  const { data } = await res.json()
  const submissions = JSON.parse(data.matchedUser.userCalendar.submissionCalendar as string) as Record<string, number>

  // Form epoch time for today, UTC @ 12:00:00 AM
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
  // https://stackoverflow.com/questions/948532/how-to-convert-a-date-to-utc
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime() / 1000

  return (submissions[today] ?? 0) > 0
}
