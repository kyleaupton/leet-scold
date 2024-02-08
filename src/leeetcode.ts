export const wasNotACompletePieceOfShitToday = async (username: string): Promise<boolean> => {
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

export const fetchDailyProblem = async (): Promise<string> => {
  const linkRes = await fetch('https://leetcode.com/graphql/', {
    headers: {
      'content-type': 'application/json'
    },
    body: '{"query":"\\n    query questionOfToday {\\n  activeDailyCodingChallengeQuestion {\\n    date\\n    userStatus\\n    link\\n    question {\\n      acRate\\n      difficulty\\n      freqBar\\n      frontendQuestionId: questionFrontendId\\n      isFavor\\n      paidOnly: isPaidOnly\\n      status\\n      title\\n      titleSlug\\n      hasVideoSolution\\n      hasSolution\\n      topicTags {\\n        name\\n        id\\n        slug\\n      }\\n    }\\n  }\\n}\\n    ","variables":{},"operationName":"questionOfToday"}',
    method: 'POST'
  })

  const dailyLink = (await linkRes.json()).data.activeDailyCodingChallengeQuestion.link

  const problemName = dailyLink.split('/')[2]

  const questionRes = await fetch('https://leetcode.com/graphql/', {
    headers: {
      'content-type': 'application/json'
    },
    body: `{"query":"\\n    query questionContent($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    content\\n    mysqlSchemas\\n    dataSchemas\\n  }\\n}\\n    ","variables":{"titleSlug":"${problemName}"},"operationName":"questionContent"}`,
    method: 'POST'
  })

  const questionText = (await questionRes.json()).data.question.content

  return questionText
}
