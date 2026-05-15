module Spina
  module Parts
    class StreamField < Base
      include AttrJson::NestedAttributes

      @component_types = {
        "Markdown" => "Spina::Parts::Markdown",
        "Image"    => "Spina::Parts::Image",
        "Rich Text"    => "Spina::Parts::Text"
      }

      class << self
        def component_types
          @component_types.dup.freeze
        end

        # label - human-readable string shown in the "Add Block" menu
        # klass - part class or fully-qualified string name
        def register_component(label, klass)
          class_name = klass.is_a?(Class) ? klass.name : klass.to_s
          raise ArgumentError, "label must be a non-empty String" if label.blank?
          raise ArgumentError, "klass must resolve to a class name" if class_name.blank?
          @component_types[label] = class_name
        end

        def unregister_component(label)
          @component_types.delete(label)
        end
      end

      attr_json :content, StreamFieldContent.to_type, array: true
      attr_json_accepts_nested_attributes_for :content
    end
  end
end
