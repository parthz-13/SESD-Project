import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Authors
  const authorsData = [
    { name: 'David Thomas' },
    { name: 'Andrew Hunt' },
    { name: 'Robert C. Martin' },
    { name: 'Erich Gamma' },
    { name: 'Thomas H. Cormen' },
    { name: 'Martin Fowler' },
    { name: 'Kyle Simpson' },
    { name: 'Gayle Laakmann McDowell' },
    { name: 'Steve McConnell' },
    { name: 'Frederick P. Brooks Jr.' },
    { name: 'Harold Abelson' },
    { name: 'Daniel Kahneman' },
    { name: 'Yuval Noah Harari' },
    { name: 'James Clear' },
    { name: 'Gene Kim' },
    { name: 'George Orwell' },
    { name: 'Harper Lee' },
    { name: 'F. Scott Fitzgerald' },
    { name: 'Frank Herbert' },
    { name: 'Andy Weir' },
  ];

  const createdAuthors: any[] = [];
  for (const author of authorsData) {
    const created = await prisma.author.create({ data: author });
    createdAuthors.push(created);
  }

  // Create Categories
  const categoriesData = [
    { name: 'Software Engineering' },
    { name: 'Algorithms' },
    { name: 'JavaScript' },
    { name: 'Interview Preparation' },
    { name: 'Psychology' },
    { name: 'History' },
    { name: 'Self-Help' },
    { name: 'DevOps' },
    { name: 'Fiction' },
    { name: 'Science Fiction' },
  ];

  const createdCategories: any[] = [];
  for (const category of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  // Helper function to find author by name
  const getAuthorId = (name: string) => createdAuthors.find((a) => a.name === name)?.id;
  const getCategoryId = (name: string) => createdCategories.find((c) => c.name === name)?.id;

  // Create Books
  const booksData = [
    {
      title: 'The Pragmatic Programmer',
      isbn: '978-0135957059',
      publisher: 'Addison-Wesley Professional',
      year: 2019,
      totalCopies: 5,
      availableCopies: 5,
      description: 'Your journey to mastery.',
      authorNames: ['David Thomas', 'Andrew Hunt'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      year: 2008,
      totalCopies: 8,
      availableCopies: 8,
      description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
      authorNames: ['Robert C. Martin'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      isbn: '978-0201633610',
      publisher: 'Addison-Wesley Professional',
      year: 1994,
      totalCopies: 4,
      availableCopies: 4,
      description: 'Capturing a wealth of experience about the design of object-oriented software.',
      authorNames: ['Erich Gamma'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'Introduction to Algorithms',
      isbn: '978-0262033848',
      publisher: 'MIT Press',
      year: 2009,
      totalCopies: 3,
      availableCopies: 3,
      description: 'Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor.',
      authorNames: ['Thomas H. Cormen'],
      categoryNames: ['Algorithms', 'Software Engineering'],
    },
    {
      title: 'Refactoring: Improving the Design of Existing Code',
      isbn: '978-0134757599',
      publisher: 'Addison-Wesley Professional',
      year: 2018,
      totalCopies: 6,
      availableCopies: 6,
      description: 'Fully Revised and Updated.',
      authorNames: ['Martin Fowler'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'You Don\'t Know JS Yet: Get Started',
      isbn: '978-4567890123',
      publisher: 'Independently published',
      year: 2020,
      totalCopies: 4,
      availableCopies: 4,
      description: 'A deep dive into the core mechanisms of the JavaScript language.',
      authorNames: ['Kyle Simpson'],
      categoryNames: ['JavaScript', 'Software Engineering'],
    },
    {
      title: 'Cracking the Coding Interview',
      isbn: '978-0984782857',
      publisher: 'Careercup',
      year: 2015,
      totalCopies: 10,
      availableCopies: 10,
      description: '189 Programming Questions and Solutions.',
      authorNames: ['Gayle Laakmann McDowell'],
      categoryNames: ['Interview Preparation', 'Algorithms'],
    },
    {
      title: 'Clean Architecture',
      isbn: '978-0134494166',
      publisher: 'Prentice Hall',
      year: 2017,
      totalCopies: 5,
      availableCopies: 5,
      description: 'A Craftsman\'s Guide to Software Structure and Design.',
      authorNames: ['Robert C. Martin'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'Code Complete',
      isbn: '978-0735619678',
      publisher: 'Microsoft Press',
      year: 2004,
      totalCopies: 3,
      availableCopies: 3,
      description: 'A Practical Handbook of Software Construction.',
      authorNames: ['Steve McConnell'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'The Mythical Man-Month',
      isbn: '978-0201835953',
      publisher: 'Addison-Wesley Professional',
      year: 1995,
      totalCopies: 2,
      availableCopies: 2,
      description: 'Essays on Software Engineering.',
      authorNames: ['Frederick P. Brooks Jr.'],
      categoryNames: ['Software Engineering'],
    },
    {
      title: 'Structure and Interpretation of Computer Programs',
      isbn: '978-0262510875',
      publisher: 'MIT Press',
      year: 1996,
      totalCopies: 4,
      availableCopies: 4,
      description: 'SICP',
      authorNames: ['Harold Abelson'],
      categoryNames: ['Software Engineering', 'Algorithms'],
    },
    {
      title: 'Thinking, Fast and Slow',
      isbn: '978-0374533557',
      publisher: 'Farrar, Straus and Giroux',
      year: 2013,
      totalCopies: 6,
      availableCopies: 6,
      description: 'The phenomenal New York Times Bestseller.',
      authorNames: ['Daniel Kahneman'],
      categoryNames: ['Psychology'],
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      isbn: '978-0062316097',
      publisher: 'Harper',
      year: 2015,
      totalCopies: 7,
      availableCopies: 7,
      description: 'A brief history of humankind.',
      authorNames: ['Yuval Noah Harari'],
      categoryNames: ['History'],
    },
    {
      title: 'Atomic Habits',
      isbn: '978-0735211292',
      publisher: 'Avery',
      year: 2018,
      totalCopies: 12,
      availableCopies: 12,
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
      authorNames: ['James Clear'],
      categoryNames: ['Self-Help'],
    },
    {
      title: 'The Phoenix Project',
      isbn: '978-1942788294',
      publisher: 'IT Revolution Press',
      year: 2018,
      totalCopies: 5,
      availableCopies: 5,
      description: 'A Novel about IT, DevOps, and Helping Your Business Win.',
      authorNames: ['Gene Kim'],
      categoryNames: ['DevOps', 'Fiction'],
    },
    {
      title: '1984',
      isbn: '978-0451524935',
      publisher: 'Signet Classic',
      year: 1961,
      totalCopies: 8,
      availableCopies: 8,
      description: 'Among the seminal texts of the 20th century.',
      authorNames: ['George Orwell'],
      categoryNames: ['Fiction', 'Science Fiction'],
    },
    {
      title: 'To Kill a Mockingbird',
      isbn: '978-0060935467',
      publisher: 'Harper Perennial Modern Classics',
      year: 2002,
      totalCopies: 10,
      availableCopies: 10,
      description: 'A novel by Harper Lee published in 1960.',
      authorNames: ['Harper Lee'],
      categoryNames: ['Fiction'],
    },
    {
      title: 'The Great Gatsby',
      isbn: '978-0743273565',
      publisher: 'Scribner',
      year: 2004,
      totalCopies: 6,
      availableCopies: 6,
      description: 'The story of the mysteriously wealthy Jay Gatsby.',
      authorNames: ['F. Scott Fitzgerald'],
      categoryNames: ['Fiction'],
    },
    {
      title: 'Dune',
      isbn: '978-0441172719',
      publisher: 'Ace Books',
      year: 1990,
      totalCopies: 5,
      availableCopies: 5,
      description: 'Set on the desert planet Arrakis.',
      authorNames: ['Frank Herbert'],
      categoryNames: ['Science Fiction'],
    },
    {
      title: 'The Martian',
      isbn: '978-0553418026',
      publisher: 'Crown',
      year: 2014,
      totalCopies: 7,
      availableCopies: 7,
      description: 'Nominated as one of America’s best-loved novels.',
      authorNames: ['Andy Weir'],
      categoryNames: ['Science Fiction'],
    },
  ];

  for (const book of booksData) {
    const { authorNames, categoryNames, ...bookFields } = book;
    
    // skip if ISBN already exists
    const existing = await prisma.book.findUnique({ where: { isbn: bookFields.isbn }});
    if (existing) continue;

    const createdBook = await prisma.book.create({
      data: bookFields,
    });

    for (const authorName of authorNames) {
      const authorId = getAuthorId(authorName);
      if (authorId) {
        await prisma.bookAuthor.create({
          data: {
            bookId: createdBook.id,
            authorId: authorId,
          },
        });
      }
    }

    for (const categoryName of categoryNames) {
      const categoryId = getCategoryId(categoryName);
      if (categoryId) {
        await prisma.bookCategory.create({
          data: {
            bookId: createdBook.id,
            categoryId: categoryId,
          },
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
