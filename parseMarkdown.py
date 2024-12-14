import re
import json

def slugify(text):
    """Convert text to a URL-friendly slug."""
    return re.sub(r'[^\w\s-]', '', text.lower()).replace(' ', '-')

def parse_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Split content into lines
    lines = content.split('\n')
    
    # Initialize variables
    topics = []
    current_topic = None
    current_content = []
    
    for line in lines:
        # H2 heading detection
        h2_match = re.match(r'^## (.+)', line)
        if h2_match:
            # If there's a previous topic, save it
            if current_topic:
                current_topic['content'] = '\n'.join(current_content).strip()
                topics.append(current_topic)
                current_content = []
            
            # Start a new topic
            title = h2_match.group(1)
            current_topic = {
                'content': None,
                'materialId': slugify(title),
                'title': title,
                'topicId': 'tata-laksana-penyelenggaraan-statistik'
            }
        elif current_topic and line.strip():
            # Collect content for the current topic
            current_content.append(line)
    
    # Add the last topic
    if current_topic:
        current_topic['content'] = '\n'.join(current_content).strip()
        topics.append(current_topic)
    
    return topics

# Convert to JSON
def convert_to_json(topics):
    return json.dumps(topics, ensure_ascii=False, indent=2)

# Main execution
if __name__ == '__main__':
    input_file = './public/topics.md'
    topics = parse_markdown(input_file)
    json_output = convert_to_json(topics)
    
    # Print or save the output
    print(json_output)
    
    # Optionally, save to a JSON file
    with open('topics.json', 'w', encoding='utf-8') as f:
        f.write(json_output)