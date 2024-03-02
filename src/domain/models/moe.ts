export class Project {
  constructor(
    readonly name: string,
    readonly id?: string,
  ) {}
}

export class Unit {
  constructor(
    readonly title: string,
    readonly id?: string,
    readonly commitId?: string,
  ) {
    this.title = title;
  }
}

export class Source {
  constructor(
    readonly sq: number,
    readonly content: string,
    readonly meta: string,
  ) {}
}

export class Commit {
  constructor(
    readonly id: string,
    readonly createdBy: string,
    readonly createdAt: string,
  ) {}
}

export class TextRecord {
  constructor(
    readonly sq: number,
    readonly content: string,
  ) {}
}

export class TextPair {
  constructor(
    readonly sq: number,
    readonly meta: string,
    readonly source: string,
    readonly record: string,
  ) {}
}

export type UserInfo = {
  id: string;
  isAdmin: boolean;
};

export const makeTextPair = (
  sourceList: Source[],
  recordList?: TextRecord[],
) => {
  const map = new Map<
    number,
    {
      meta?: string;
      source?: string;
      target?: string;
    }
  >();

  sourceList.forEach(({ sq, meta, content }) => {
    const entry = map.get(sq) ?? {};
    entry.meta = meta;
    entry.source = content;
    map.set(sq, entry);
  });

  recordList?.forEach(({ sq, content }) => {
    const entry = map.get(sq) ?? {};
    entry.target = content;
    map.set(sq, entry);
  });

  const textPairList: TextPair[] = [];

  map.forEach(({ meta, source, target }, sq) => {
    if (meta && source) {
      textPairList.push(new TextPair(sq, meta, source, target ?? ""));
    }
  });

  return textPairList;
};
