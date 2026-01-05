from django.core.management.base import BaseCommand
from quiz.models import QuizQuestion


class Command(BaseCommand):
    help = 'List all quiz questions in the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=10,
            help='Number of questions to display'
        )
        parser.add_argument(
            '--published-only',
            action='store_true',
            help='Show only published questions'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        published_only = options['published_only']

        queryset = QuizQuestion.objects.all()
        if published_only:
            queryset = queryset.filter(is_published=True)

        total_count = queryset.count()
        questions = queryset[:limit]

        self.stdout.write(f'\n=== QUIZ QUESTIONS ({total_count} total) ===\n')

        for i, question in enumerate(questions, 1):
            self.stdout.write(f'{i}. {question.question_string[:80]}...')
            self.stdout.write(f'   Type: {question.type}')
            self.stdout.write(f'   Difficulty: {question.difficulty}')
            self.stdout.write(f'   Published: {question.is_published}')
            self.stdout.write(f'   Tags: {", ".join(question.tag)}')
            self.stdout.write(f'   Answer: {question.answer}')
            self.stdout.write(f'   Created: {question.created_at.strftime("%Y-%m-%d %H:%M")}')
            self.stdout.write()

        if total_count > limit:
            self.stdout.write(f'... and {total_count - limit} more questions')

