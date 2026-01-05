from django.core.management.base import BaseCommand
from quiz.models import QuizQuestion


class Command(BaseCommand):
    help = 'Check and display all quiz questions in the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Limit the number of questions to display'
        )
        parser.add_argument(
            '--published-only',
            action='store_true',
            help='Show only published questions'
        )
        parser.add_argument(
            '--difficulty',
            type=str,
            choices=['easy', 'medium', 'hard'],
            help='Filter by difficulty level'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        published_only = options['published_only']
        difficulty = options['difficulty']
        
        # Build the base queryset for statistics (no limit)
        base_queryset = QuizQuestion.objects.all()
        
        # Filter by published only
        if published_only:
            base_queryset = base_queryset.filter(is_published=True)
            
        # Filter by difficulty
        if difficulty:
            base_queryset = base_queryset.filter(difficulty=difficulty)
        
        # Get the count from base queryset
        total_count = base_queryset.count()
        
        # Create display queryset with limit applied
        display_queryset = base_queryset
        if limit:
            display_queryset = display_queryset[:limit]
        
        # Print the total number of questions found
        self.stdout.write(
            self.style.SUCCESS(f'Found {total_count} quiz questions')
        )
        
        if total_count == 0:
            self.stdout.write('No questions found matching the criteria.')
            return
        
        # Display questions
        self.stdout.write('\n' + '='*80)
        self.stdout.write('QUIZ QUESTIONS')
        self.stdout.write('='*80)
        
        for i, question in enumerate(display_queryset, 1):
            self.stdout.write(f'\n{i}. ID: {question.id}')
            self.stdout.write(f'   Question: {question.question_string[:100]}{"..." if len(question.question_string) > 100 else ""}')
            self.stdout.write(f'   Type: {question.type}')
            self.stdout.write(f'   Difficulty: {question.difficulty}')
            self.stdout.write(f'   Published: {question.is_published}')
            self.stdout.write(f'   Tags: {", ".join(question.tag) if question.tag else "None"}')
            self.stdout.write(f'   Created: {question.created_at.strftime("%Y-%m-%d %H:%M:%S")}')
            
            # Show answer information based on type
            if question.type == 'multiple_choice':
                options = question.get_answer_options()
                correct = question.get_correct_answer()
                if options:
                    self.stdout.write(f'   Options: {options}')
                    self.stdout.write(f'   Correct Answer: {correct}')
            else:
                answer = question.get_correct_answer()
                self.stdout.write(f'   Answer: {answer[:50]}{"..." if len(str(answer)) > 50 else ""}')
            
            self.stdout.write('-' * 80)
        
        # Summary statistics
        self.stdout.write('\n' + '='*80)
        self.stdout.write('SUMMARY STATISTICS')
        self.stdout.write('='*80)
        
        # Count by type
        type_counts = {}
        for question_type, _ in QuizQuestion.QUESTION_TYPE_CHOICES:
            count = base_queryset.filter(type=question_type).count()
            if count > 0:
                type_counts[question_type] = count
        
        self.stdout.write('\nBy Question Type:')
        for question_type, count in type_counts.items():
            self.stdout.write(f'  {question_type}: {count}')
        
        # Count by difficulty
        difficulty_counts = {}
        for difficulty_level, _ in QuizQuestion.DIFFICULTY_CHOICES:
            count = base_queryset.filter(difficulty=difficulty_level).count()
            if count > 0:
                difficulty_counts[difficulty_level] = count
        
        self.stdout.write('\nBy Difficulty:')
        for difficulty_level, count in difficulty_counts.items():
            self.stdout.write(f'  {difficulty_level}: {count}')
        
        # Published vs Unpublished
        published_count = base_queryset.filter(is_published=True).count()
        unpublished_count = base_queryset.filter(is_published=False).count()
        
        self.stdout.write('\nBy Publication Status:')
        self.stdout.write(f'  Published: {published_count}')
        self.stdout.write(f'  Unpublished: {unpublished_count}')
        
        self.stdout.write('\n' + '='*80)
