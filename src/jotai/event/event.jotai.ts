import { ResetEvent, ResetEventParticipant, ResetParticipantFunction, TEvent, TEventParticipant, TParticipantFunction } from "@/types/event/event.type";
import { atom } from "jotai";

export const eventModalAtom = atom<boolean>(false);
export const eventAtom = atom<TEvent>(ResetEvent);

export const eventParticipantModalPresenceAtom = atom<boolean>(false);
export const eventParticipantModalAtom = atom<boolean>(false);
export const eventParticipantAtom = atom<TEventParticipant>(ResetEventParticipant);

export const eventParticipanFunctiontModalAtom = atom<boolean>(false);
export const eventParticipanFunctiontAtom = atom<TParticipantFunction>(ResetParticipantFunction);