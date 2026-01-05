import json
import os
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from quiz.models import QuizQuestion


class Command(BaseCommand):
    help = 'Import quiz questions from test_bank.json into the database'

    def add_arguments(self, parser):
        parser.add_argument( # argument to specify the file to import
            '--file',
            type=str,
            default='quiz/test_bank.json'
        )
        parser.add_argument( # argument to clear the existing questions
            '--clear',
            action='store_true', # store_true means that the argument is a boolean flag that is true if the argument is present, false otherwise
        )

    def handle(self, *args, **options):
        file_path = options['file'] # get the file path from the arguments
        clear_existing = options['clear'] # get the clear flag from the arguments

        # Get the full path to the JSON file
        if not os.path.isabs(file_path):
            # Go up from management/commands/ to backend/ then add the file path
            backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))) # go up from management/commands/ to backend/ then add the file path
            file_path = os.path.join(backend_dir, file_path) # join the backend_dir and the file_path

        if not os.path.exists(file_path):
            raise CommandError(f'File "{file_path}" does not exist.')

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                questions_data = json.load(file) # load the json file into a dictionary
        except json.JSONDecodeError as e:
            raise CommandError(f'Invalid JSON in file "{file_path}": {e}')
        except Exception as e:
            raise CommandError(f'Error reading file "{file_path}": {e}')

        if not isinstance(questions_data, list):
            raise CommandError('JSON file must contain an array of questions.')

        # Clear existing questions if requested
        if clear_existing:
            deleted_count = QuizQuestion.objects.count()
            QuizQuestion.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing quiz questions.')
            )

        # Import questions
        created_count = 0
        updated_count = 0
        errors = []

        with transaction.atomic():
            for i, question_data in enumerate(questions_data):
                try:
                    # Check if question already exists (by question_string)
                    question_string = question_data.get('question_string')
                    if not question_string:
                        errors.append(f'Question {i+1}: Missing question_string')
                        continue

                    existed = QuizQuestion.objects.filter(
                        question_string=question_string
                    ).first()

                    if existed:
                        # Update existing question
                        for field, value in question_data.items():
                            if hasattr(existed, field):
                                setattr(existed, field, value)
                        existed.save()
                        updated_count += 1
                        self.stdout.write(f'Updated: {question_string[:50]}...')
                    else:
                        # Create new question
                        QuizQuestion.objects.create(**question_data)
                        created_count += 1
                        self.stdout.write(f'Created: {question_string[:50]}...')

                except Exception as e:
                    error_msg = f'Question {i+1}: {str(e)}'
                    errors.append(error_msg)
                    self.stdout.write(
                        self.style.ERROR(f'Error processing question {i+1}: {e}')
                    )

        # Report results
        self.stdout.write(
            self.style.SUCCESS(
                f'\nImport completed!\n'
                f'Created: {created_count} questions\n'
                f'Updated: {updated_count} questions\n'
                f'Errors: {len(errors)} questions'
            )
        )

        if errors:
            self.stdout.write(self.style.WARNING('\nErrors encountered:'))
            for error in errors:
                self.stdout.write(f'  - {error}')

        # Show total count
        total_questions = QuizQuestion.objects.count()
        self.stdout.write(f'\nTotal questions in database: {total_questions}')
