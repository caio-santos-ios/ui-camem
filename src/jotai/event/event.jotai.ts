import { ResetEvent, ResetEventParticipant, TEvent, TEventParticipant } from "@/types/event/event.type";
import { atom } from "jotai";

export const eventModalAtom = atom<boolean>(false);
export const eventAtom = atom<TEvent>(ResetEvent);

export const eventParticipantModalAtom = atom<boolean>(false);
export const eventParticipantAtom = atom<TEventParticipant>(ResetEventParticipant);