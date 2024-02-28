class Project {
  constructor(
    readonly name: string,
    readonly id?: string,
  ) {}
}

class Unit {
  constructor(
    readonly title: string,
    readonly id?: string,
    readonly commitId?: string,
  ) {
    this.title = title;
  }
}

class Source {
  constructor(
    readonly sq: number,
    readonly content: string,
    readonly meta: string,
  ) {}
}

class Commit {
  constructor(
    readonly id: string,
    readonly createdAt: string,
  ) {}
}

class TextRecord {
  constructor(
    readonly sq: number,
    readonly content: string,
  ) {}
}

class TextPair {
  constructor(
    readonly sq: number,
    readonly meta: string,
    readonly source: string,
    readonly record: string,
  ) {}
}

const makeTextPair = (sourceList: Source[], recordList?: TextRecord[]) => {
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

export { TextPair, Project, Unit, Source, Commit, TextRecord };
export { makeTextPair };
