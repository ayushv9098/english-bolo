// ─────────────────────────────────────────────────────────────
// QUICK REPLY — content bank
// Chat prompts with three replies: the natural one (15), an awkward
// but understandable one (5), and a wrong one (0). Each session pulls
// a fresh randomized set so replies don't repeat.
// ─────────────────────────────────────────────────────────────
import { shuffle } from "./quizBank";

export type ReplyOption = { text: string; points: number };
export type Scenario = { ai: string; options: ReplyOption[] };

const SCENARIOS: Scenario[] = [
  { ai: "Hey, are you free this evening?", options: [
    { text: "Sounds good, I'm free!", points: 15 },
    { text: "I am having free time.", points: 5 },
    { text: "What is evening?", points: 0 },
  ] },
  { ai: "We should check out that new cafe.", options: [
    { text: "Yeah, let's do it!", points: 15 },
    { text: "We go to cafe yes.", points: 5 },
    { text: "I not go.", points: 0 },
  ] },
  { ai: "Can you send me the files by 5 PM?", options: [
    { text: "Sure, I'll send them right away.", points: 15 },
    { text: "I sending you 5 PM.", points: 5 },
    { text: "No files.", points: 0 },
  ] },
  { ai: "Sorry I'm running a bit late!", options: [
    { text: "No worries, take your time.", points: 15 },
    { text: "You are late.", points: 5 },
    { text: "Why late?", points: 0 },
  ] },
  { ai: "Happy birthday! Have a great day!", options: [
    { text: "Thank you so much!", points: 15 },
    { text: "Same to you birthday.", points: 5 },
    { text: "Today not my day.", points: 0 },
  ] },
  { ai: "Did you watch the match yesterday?", options: [
    { text: "Yes, it was amazing!", points: 15 },
    { text: "I watching match yes.", points: 5 },
    { text: "Match is where?", points: 0 },
  ] },
  { ai: "Thanks a lot for your help!", options: [
    { text: "You're welcome, anytime!", points: 15 },
    { text: "It's okay no problem help.", points: 5 },
    { text: "I not help you.", points: 0 },
  ] },
  { ai: "Do you want to join us for dinner?", options: [
    { text: "I'd love to, thanks!", points: 15 },
    { text: "Dinner yes I come.", points: 5 },
    { text: "Dinner is food?", points: 0 },
  ] },
  { ai: "I think I left my phone at your place.", options: [
    { text: "Oh, I'll check and let you know.", points: 15 },
    { text: "Your phone is here maybe.", points: 5 },
    { text: "I take your phone.", points: 0 },
  ] },
  { ai: "How was your weekend?", options: [
    { text: "It was relaxing, thanks for asking!", points: 15 },
    { text: "Weekend was good time.", points: 5 },
    { text: "Weekend is two day.", points: 0 },
  ] },
  { ai: "Can we reschedule our meeting?", options: [
    { text: "Sure, what time works for you?", points: 15 },
    { text: "Okay we do meeting other.", points: 5 },
    { text: "Meeting is cancel forever.", points: 0 },
  ] },
  { ai: "Congratulations on your new job!", options: [
    { text: "Thank you, I'm really excited!", points: 15 },
    { text: "Yes new job thank.", points: 5 },
    { text: "Job is very hard no.", points: 0 },
  ] },
  { ai: "It's raining heavily outside.", options: [
    { text: "Stay safe and carry an umbrella!", points: 15 },
    { text: "Rain is coming much.", points: 5 },
    { text: "I like the sun.", points: 0 },
  ] },
  { ai: "Are you coming to the party tonight?", options: [
    { text: "Yes, I'll be there!", points: 15 },
    { text: "Party tonight I think come.", points: 5 },
    { text: "Where is my house?", points: 0 },
  ] },
  { ai: "I'm feeling a bit unwell today.", options: [
    { text: "Oh no, take care and get some rest.", points: 15 },
    { text: "You are sick today bad.", points: 5 },
    { text: "Me too I am fine.", points: 0 },
  ] },
  { ai: "What time should we meet tomorrow?", options: [
    { text: "How about 10 in the morning?", points: 15 },
    { text: "Tomorrow time we meet.", points: 5 },
    { text: "Tomorrow is which day?", points: 0 },
  ] },
];

/** A fresh randomized set of `n` chat scenarios, each with shuffled options. */
export function getQuickReplySession(n = 6): Scenario[] {
  return shuffle(SCENARIOS)
    .slice(0, n)
    .map((s) => ({ ...s, options: shuffle(s.options) }));
}
